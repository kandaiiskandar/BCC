import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import MainLayout from '../../components/layout/MainLayout'
import { useReports, getReportDateRange } from '../../hooks/useReports'
import { formatRM, formatDateBM, getExpenseCategoryLabel, getRevenueTypeLabel, getPaymentMethodLabel } from '../../utils/formatters'
import { FileText, Download, Search, BarChart2, AlertCircle } from 'lucide-react'

const MONTHS = [
  { value: '1', label: 'Januari' }, { value: '2', label: 'Februari' },
  { value: '3', label: 'Mac' },     { value: '4', label: 'April' },
  { value: '5', label: 'Mei' },     { value: '6', label: 'Jun' },
  { value: '7', label: 'Julai' },   { value: '8', label: 'Ogos' },
  { value: '9', label: 'September' },{ value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },{ value: '12', label: 'Disember' },
]

const QUARTERS = [
  { value: '1', label: 'Suku 1 (Jan–Mac)' },
  { value: '2', label: 'Suku 2 (Apr–Jun)' },
  { value: '3', label: 'Suku 3 (Jul–Sep)' },
  { value: '4', label: 'Suku 4 (Okt–Dis)' },
]

const currentYear  = new Date().getFullYear()
const currentMonth = String(new Date().getMonth() + 1)
const YEARS = Array.from({ length: 3 }, (_, i) => String(currentYear - i))

// ─── Excel export helper ────────────────────────────────────────────────────

function formatRMPlain(value) {
  return parseFloat((value || 0).toFixed(2))
}

function buildExcel(reportData) {
  const wb = XLSX.utils.book_new()

  // ── Sheet 1: Ringkasan Projek ──────────────────────────────────────────
  const summaryHeader = [
    ['LAPORAN KEWANGAN — BUSINESS COMMAND CENTRE'],
    [`Koperasi Pembangunan Usahasama Masyarakat Maju Sabah Berhad (Kop-Pusamaju)`],
    [`Tempoh: ${reportData.label}`],
    [`Dijana pada: ${new Date().toLocaleDateString('ms-MY', { dateStyle: 'full' })}`],
    [],
    ['Bil.', 'Projek', 'Industri', 'Hasil (RM)', 'Belanja Diluluskan (RM)', 'Untung Bersih (RM)', 'Sasaran Hasil (RM)', '% Pencapaian', 'Status'],
  ]

  const summaryRows = reportData.summary.map((p, i) => [
    i + 1,
    p.name,
    p.industry,
    formatRMPlain(p.sales),
    formatRMPlain(p.expenses),
    formatRMPlain(p.profit),
    formatRMPlain(p.targetRevenue),
    p.targetPct !== null ? parseFloat(p.targetPct.toFixed(1)) : 'Tiada Sasaran',
    p.status.replace(/[🟢🟡🔴⚪]/g, '').trim(),
  ])

  const summaryFooter = [
    [],
    ['', 'JUMLAH KESELURUHAN', '',
      formatRMPlain(reportData.totals.sales),
      formatRMPlain(reportData.totals.expenses),
      formatRMPlain(reportData.totals.profit),
      '', '', '',
    ],
  ]

  const summaryData = [...summaryHeader, ...summaryRows, ...summaryFooter]
  const ws1 = XLSX.utils.aoa_to_sheet(summaryData)

  // Column widths
  ws1['!cols'] = [
    { wch: 5 }, { wch: 28 }, { wch: 22 }, { wch: 18 },
    { wch: 22 }, { wch: 18 }, { wch: 18 }, { wch: 14 }, { wch: 22 },
  ]
  XLSX.utils.book_append_sheet(wb, ws1, 'Ringkasan Projek')

  // ── Sheet 2: Data Jualan ───────────────────────────────────────────────
  const salesHeader = [
    ['DATA REKOD JUALAN'],
    [`Tempoh: ${reportData.label}`],
    [],
    ['Bil.', 'Tarikh', 'Projek', 'Jenis Hasil', 'Nama Pelanggan', 'Produk / Perkhidmatan', 'Kaedah Bayaran', 'No. Invois', 'Jumlah (RM)', 'Dimasukkan Oleh', 'Nota'],
  ]

  const salesRows = reportData.salesRaw.map((s, i) => [
    i + 1,
    formatDateBM(s.sale_date),
    s.projects?.name || '',
    getRevenueTypeLabel(s.revenue_type),
    s.client_name || '',
    s.product_service_name || '',
    getPaymentMethodLabel(s.payment_method),
    s.invoice_ref || '',
    formatRMPlain(s.amount),
    s.profiles?.full_name || '',
    s.notes || '',
  ])

  const salesData = [...salesHeader, ...salesRows]
  const ws2 = XLSX.utils.aoa_to_sheet(salesData)
  ws2['!cols'] = [
    { wch: 5 }, { wch: 16 }, { wch: 22 }, { wch: 20 }, { wch: 25 },
    { wch: 28 }, { wch: 18 }, { wch: 16 }, { wch: 14 }, { wch: 20 }, { wch: 30 },
  ]
  XLSX.utils.book_append_sheet(wb, ws2, 'Data Jualan')

  // ── Sheet 3: Data Belanja Diluluskan ──────────────────────────────────
  const expenseHeader = [
    ['DATA PERBELANJAAN DILULUSKAN'],
    [`Tempoh: ${reportData.label}`],
    [],
    ['Bil.', 'Tarikh', 'Projek', 'Kategori', 'Penerangan', 'Jumlah (RM)', 'Dimasukkan Oleh'],
  ]

  const expenseRows = reportData.expensesRaw.map((e, i) => [
    i + 1,
    formatDateBM(e.expense_date),
    e.projects?.name || '',
    getExpenseCategoryLabel(e.category),
    e.description || '',
    formatRMPlain(e.amount),
    e.profiles?.full_name || '',
  ])

  const expenseData = [...expenseHeader, ...expenseRows]
  const ws3 = XLSX.utils.aoa_to_sheet(expenseData)
  ws3['!cols'] = [
    { wch: 5 }, { wch: 16 }, { wch: 22 }, { wch: 28 },
    { wch: 40 }, { wch: 14 }, { wch: 20 },
  ]
  XLSX.utils.book_append_sheet(wb, ws3, 'Belanja Diluluskan')

  return wb
}

function downloadExcel(reportData) {
  const wb = buildExcel(reportData)
  const filename = `Laporan_BCC_${reportData.label.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`
  XLSX.writeFile(wb, filename)
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function Reports() {
  const { reportData, loading, error, fetchReport } = useReports()

  const [filter,  setFilter]  = useState('month')
  const [year,    setYear]    = useState(String(currentYear))
  const [month,   setMonth]   = useState(currentMonth)
  const [quarter, setQuarter] = useState('3')

  const handleGenerate = () => {
    fetchReport(filter, year, month, quarter)
  }

  const { label: previewLabel } = getReportDateRange(filter, year, month, quarter)

  return (
    <MainLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Laporan Kewangan</h1>
          <p className="text-sm text-slate-500 mt-1">
            Jana dan eksport laporan hasil, belanja, dan prestasi projek mengikut tempoh.
          </p>
        </div>

        {/* Filter Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Penapis Laporan</h2>

          <div className="flex flex-wrap gap-4 items-end">
            {/* Filter type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Tempoh</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
              >
                <option value="month">Bulanan</option>
                <option value="quarter">Suku Tahun</option>
                <option value="ytd">Tahun Penuh (YTD)</option>
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
              >
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            {/* Month — only for 'month' filter */}
            {filter === 'month' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bulan</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                >
                  {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
            )}

            {/* Quarter — only for 'quarter' filter */}
            {filter === 'quarter' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Suku Tahun</label>
                <select
                  value={quarter}
                  onChange={(e) => setQuarter(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                >
                  {QUARTERS.map((q) => <option key={q.value} value={q.value}>{q.label}</option>)}
                </select>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Memuatkan...' : 'Jana Laporan'}
            </button>

            {reportData && (
              <button
                onClick={() => downloadExcel(reportData)}
                className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                Eksport Excel (.xlsx)
              </button>
            )}
          </div>

          <p className="text-xs text-slate-400 mt-3">
            Laporan akan dijana untuk tempoh: <span className="font-semibold text-slate-600">{previewLabel}</span>
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-sm rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            Gagal memuatkan data laporan: {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-500">Mengumpul data laporan...</p>
          </div>
        )}

        {/* Report Preview */}
        {reportData && !loading && (
          <>
            {/* Report Header */}
            <div className="bg-blue-900 text-white rounded-2xl p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-blue-300 font-semibold uppercase tracking-wider mb-1">Laporan Kewangan</p>
                  <h2 className="text-lg font-bold">Koperasi Pembangunan Usahasama Masyarakat Maju Sabah Berhad</h2>
                  <p className="text-blue-200 text-sm mt-1">Tempoh: {reportData.label}</p>
                </div>
                <div className="text-right text-xs text-blue-300">
                  <p>Dijana: {new Date().toLocaleDateString('ms-MY', { dateStyle: 'long' })}</p>
                </div>
              </div>

              {/* KPI Row */}
              <div className="grid grid-cols-3 gap-4 mt-5">
                {[
                  { label: 'Jumlah Hasil', value: formatRM(reportData.totals.sales), color: 'text-emerald-300' },
                  { label: 'Jumlah Belanja', value: formatRM(reportData.totals.expenses), color: 'text-red-300' },
                  { label: 'Untung Bersih', value: formatRM(reportData.totals.profit), color: reportData.totals.profit >= 0 ? 'text-emerald-300' : 'text-red-300' },
                ].map((kpi) => (
                  <div key={kpi.label} className="bg-white/10 rounded-xl p-4">
                    <p className="text-xs text-blue-300 mb-1">{kpi.label}</p>
                    <p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
                <BarChart2 className="w-5 h-5 text-blue-900" />
                <h3 className="text-sm font-semibold text-slate-900">Ringkasan Prestasi Per Projek</h3>
                <span className="ml-auto text-xs text-slate-400">{reportData.summary.length} projek</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">
                      <th className="py-3 px-5">Projek</th>
                      <th className="py-3 px-5">Industri</th>
                      <th className="py-3 px-5 text-right">Hasil (RM)</th>
                      <th className="py-3 px-5 text-right">Belanja (RM)</th>
                      <th className="py-3 px-5 text-right">Untung (RM)</th>
                      <th className="py-3 px-5 text-right">% Sasaran</th>
                      <th className="py-3 px-5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {reportData.summary.map((proj, idx) => (
                      <tr key={proj.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-5">
                          <span className="text-xs text-slate-400 mr-1.5">{idx + 1}.</span>
                          <span className="font-semibold text-slate-900">{proj.name}</span>
                        </td>
                        <td className="py-3.5 px-5 text-xs text-slate-500">{proj.industry}</td>
                        <td className="py-3.5 px-5 text-right font-semibold text-slate-800">{formatRM(proj.sales)}</td>
                        <td className="py-3.5 px-5 text-right text-slate-600">{formatRM(proj.expenses)}</td>
                        <td className={`py-3.5 px-5 text-right font-bold ${proj.profit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                          {formatRM(proj.profit)}
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          {proj.targetPct !== null ? (
                            <span className="text-sm font-semibold text-slate-700">{proj.targetPct.toFixed(1)}%</span>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-5 text-center text-sm">{proj.status.split(' ')[0]}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50 border-t-2 border-slate-200 text-sm font-bold">
                      <td colSpan={2} className="py-3 px-5 text-slate-700">JUMLAH KESELURUHAN</td>
                      <td className="py-3 px-5 text-right text-blue-900">{formatRM(reportData.totals.sales)}</td>
                      <td className="py-3 px-5 text-right text-red-600">{formatRM(reportData.totals.expenses)}</td>
                      <td className="py-3 px-5 text-right text-emerald-700">{formatRM(reportData.totals.profit)}</td>
                      <td colSpan={2} />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Data counts */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Rekod Jualan', count: reportData.salesRaw.length, icon: FileText, color: 'text-blue-700 bg-blue-50 border-blue-200' },
                { label: 'Rekod Belanja Diluluskan', count: reportData.expensesRaw.length, icon: FileText, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
              ].map((item) => (
                <div key={item.label} className={`flex items-center gap-3 p-4 rounded-xl border ${item.color}`}>
                  <item.icon className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold">{item.label}</p>
                    <p className="text-lg font-bold">{item.count} rekod</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Export reminder */}
            <div className="text-center py-4">
              <p className="text-xs text-slate-400 mb-3">
                Fail Excel mengandungi 3 helaian: Ringkasan Projek, Data Jualan, dan Data Belanja Diluluskan.
              </p>
              <button
                onClick={() => downloadExcel(reportData)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                Muat Turun Laporan Excel (.xlsx)
              </button>
            </div>
          </>
        )}

        {/* Empty state — no report generated yet */}
        {!reportData && !loading && !error && (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-700 mb-2">Pilih tempoh dan jana laporan</h3>
            <p className="text-sm text-slate-400 max-w-xs mx-auto">
              Gunakan penapis di atas untuk memilih bulan, suku tahun, atau tahun penuh, kemudian klik "Jana Laporan".
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
