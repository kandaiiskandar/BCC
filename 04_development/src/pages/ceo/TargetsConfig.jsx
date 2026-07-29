import React, { useState, useEffect } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import { useTargets } from '../../hooks/useTargets'
import { formatRM, formatDateBM } from '../../utils/formatters'
import { Target, Save, CheckCircle2, AlertCircle, Info } from 'lucide-react'

const MONTHS = [
  { value: 1, label: 'Januari' },  { value: 2, label: 'Februari' },
  { value: 3, label: 'Mac' },      { value: 4, label: 'April' },
  { value: 5, label: 'Mei' },      { value: 6, label: 'Jun' },
  { value: 7, label: 'Julai' },    { value: 8, label: 'Ogos' },
  { value: 9, label: 'September' },{ value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },{ value: 12, label: 'Disember' },
]

const currentYear  = new Date().getFullYear()
const currentMonth = new Date().getMonth() + 1
const YEARS = Array.from({ length: 3 }, (_, i) => currentYear - i + 1)

export default function TargetsConfig() {
  const { targets, projects, loading, error, fetchTargets, saveTargets } = useTargets()

  const [year,  setYear]  = useState(currentYear)
  const [month, setMonth] = useState(currentMonth)

  // Local editable rows: { [project_id]: { target_revenue, target_profit_margin } }
  const [rows, setRows] = useState({})
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Load targets when year/month changes
  useEffect(() => {
    fetchTargets(year, month)
  }, [year, month, fetchTargets])

  // Sync DB targets into local editable rows whenever data loads
  useEffect(() => {
    if (projects.length === 0) return

    const targetMap = {}
    targets.forEach((t) => { targetMap[t.project_id] = t })

    const initialRows = {}
    projects.forEach((proj) => {
      const existing = targetMap[proj.id]
      initialRows[proj.id] = {
        target_revenue:       existing ? String(existing.target_revenue)       : '',
        target_profit_margin: existing ? String(existing.target_profit_margin) : '',
      }
    })
    setRows(initialRows)
  }, [projects, targets])

  const handleChange = (projectId, field, value) => {
    setRows((prev) => ({
      ...prev,
      [projectId]: { ...prev[projectId], [field]: value },
    }))
  }

  const handleSaveAll = async () => {
    setSuccessMsg('')
    setErrorMsg('')

    // Validate — all filled rows must be valid numbers
    for (const proj of projects) {
      const row = rows[proj.id] || {}
      if (row.target_revenue !== '' && isNaN(parseFloat(row.target_revenue))) {
        setErrorMsg(`Sasaran hasil untuk ${proj.name} tidak sah.`)
        return
      }
      if (row.target_profit_margin !== '' && (isNaN(parseFloat(row.target_profit_margin)) || parseFloat(row.target_profit_margin) > 100)) {
        setErrorMsg(`Sasaran margin untuk ${proj.name} mesti antara 0–100%.`)
        return
      }
    }

    // Only save rows that have at least target_revenue filled
    const rowsToSave = projects
      .filter((proj) => rows[proj.id]?.target_revenue !== '')
      .map((proj) => ({
        project_id:           proj.id,
        target_revenue:       rows[proj.id].target_revenue       || 0,
        target_profit_margin: rows[proj.id].target_profit_margin || 0,
      }))

    if (rowsToSave.length === 0) {
      setErrorMsg('Sila masukkan sekurang-kurangnya satu sasaran hasil projek.')
      return
    }

    setSaving(true)
    const result = await saveTargets(year, month, rowsToSave)
    setSaving(false)

    if (result.success) {
      setSuccessMsg(`${rowsToSave.length} sasaran projek berjaya disimpan untuk ${MONTHS.find(m => m.value === month)?.label} ${year}.`)
    } else {
      setErrorMsg(`Gagal menyimpan sasaran: ${result.error}`)
    }
  }

  // Build a map of saved targets for quick lookup
  const targetMap = {}
  targets.forEach((t) => { targetMap[t.project_id] = t })

  const monthLabel = MONTHS.find((m) => m.value === month)?.label

  // Count projects with targets set for this period
  const setCount = projects.filter((p) => targetMap[p.id]).length

  return (
    <MainLayout>
      <div className="p-8 max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sasaran & KPI Projek</h1>
          <p className="text-sm text-slate-500 mt-1">
            Tetapkan sasaran hasil (RM) dan margin keuntungan (%) bagi setiap projek mengikut bulan.
          </p>
        </div>

        {/* Banners */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-sm rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {errorMsg}
          </div>
        )}

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun</label>
            <select
              value={year}
              onChange={(e) => { setYear(parseInt(e.target.value)); setSuccessMsg(''); setErrorMsg('') }}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
            >
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Bulan</label>
            <select
              value={month}
              onChange={(e) => { setMonth(parseInt(e.target.value)); setSuccessMsg(''); setErrorMsg('') }}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
            >
              {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-slate-500">
              {setCount}/{projects.length} projek ada sasaran
            </span>
            <button
              onClick={handleSaveAll}
              disabled={saving || loading}
              className="flex items-center gap-2 px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Menyimpan...' : 'KEMASKINI SEMUA'}
            </button>
          </div>
        </div>

        {/* Info note */}
        <div className="flex items-start gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <p>
            Sasaran ini digunakan pada <strong>Papan Pemuka</strong> dan <strong>Laporan Kewangan</strong> untuk mengira % pencapaian dan status 🟢🟡🔴 per projek.
            Kosongkan medan jika tiada sasaran untuk projek tersebut pada bulan ini.
          </p>
        </div>

        {/* Targets Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
            <Target className="w-5 h-5 text-blue-900" />
            <h2 className="text-sm font-semibold text-slate-900">
              Sasaran Bulanan — {monthLabel} {year}
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs text-slate-500">Memuatkan sasaran projek...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">
                    <th className="py-3 px-5 w-8">#</th>
                    <th className="py-3 px-5">Projek</th>
                    <th className="py-3 px-5">Industri</th>
                    <th className="py-3 px-5">Sasaran Hasil (RM)</th>
                    <th className="py-3 px-5">Sasaran Margin (%)</th>
                    <th className="py-3 px-5">Terakhir Dikemaskini</th>
                    <th className="py-3 px-5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects.map((proj, idx) => {
                    const saved   = targetMap[proj.id]
                    const row     = rows[proj.id] || { target_revenue: '', target_profit_margin: '' }
                    const hasData = !!saved

                    return (
                      <tr key={proj.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-5 text-xs text-slate-400">{idx + 1}</td>
                        <td className="py-3 px-5">
                          <p className="font-semibold text-slate-900 text-sm">{proj.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{proj.code}</p>
                        </td>
                        <td className="py-3 px-5 text-xs text-slate-500">{proj.industry}</td>

                        {/* Editable: Target Revenue */}
                        <td className="py-3 px-5">
                          <div className="relative w-44">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">RM</span>
                            <input
                              type="number"
                              min="0"
                              step="1000"
                              value={row.target_revenue}
                              onChange={(e) => handleChange(proj.id, 'target_revenue', e.target.value)}
                              placeholder="0.00"
                              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 focus:border-blue-900 text-right"
                            />
                          </div>
                          {saved && (
                            <p className="text-[10px] text-slate-400 mt-0.5 text-right w-44">
                              Disimpan: {formatRM(saved.target_revenue)}
                            </p>
                          )}
                        </td>

                        {/* Editable: Target Margin */}
                        <td className="py-3 px-5">
                          <div className="relative w-28">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.5"
                              value={row.target_profit_margin}
                              onChange={(e) => handleChange(proj.id, 'target_profit_margin', e.target.value)}
                              placeholder="0"
                              className="w-full px-3 py-2 pr-7 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 focus:border-blue-900 text-right"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">%</span>
                          </div>
                          {saved && (
                            <p className="text-[10px] text-slate-400 mt-0.5 text-right w-28">
                              Disimpan: {saved.target_profit_margin}%
                            </p>
                          )}
                        </td>

                        {/* Last updated */}
                        <td className="py-3 px-5 text-xs text-slate-500">
                          {saved ? (
                            <>
                              <p>{formatDateBM(saved.updated_at?.split('T')[0])}</p>
                              <p className="text-[10px] text-slate-400">
                                oleh {saved.profiles?.full_name || 'CEO'}
                              </p>
                            </>
                          ) : (
                            <span className="text-slate-300 italic">Belum ditetapkan</span>
                          )}
                        </td>

                        {/* Status badge */}
                        <td className="py-3 px-5 text-center">
                          {hasData ? (
                            <span className="inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                              ✅ Ditetapkan
                            </span>
                          ) : (
                            <span className="inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                              ⚪ Tiada Sasaran
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer action */}
          {!loading && projects.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Perubahan hanya disimpan apabila anda klik <strong>KEMASKINI SEMUA</strong>.
              </p>
              <button
                onClick={handleSaveAll}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Menyimpan...' : 'KEMASKINI SEMUA'}
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
