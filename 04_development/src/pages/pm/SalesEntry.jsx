import React, { useState } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import { useProjects } from '../../hooks/useProjects'
import { useSales } from '../../hooks/useSales'
import { formatRM, formatDateBM, getRevenueTypeLabel, getPaymentMethodLabel } from '../../utils/formatters'
import { PlusCircle, FileText, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react'

const ITEMS_PER_PAGE = 10

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = []
  const left = Math.max(2, current - 2)
  const right = Math.min(total - 1, current + 2)
  pages.push(1)
  if (left > 2) pages.push('...')
  for (let i = left; i <= right; i++) pages.push(i)
  if (right < total - 1) pages.push('...')
  pages.push(total)
  return pages
}

export default function SalesEntry() {
  const { projects, loading: loadingProjects } = useProjects()

  const [formData, setFormData] = useState({
    project_id: '',
    sale_date: new Date().toISOString().split('T')[0],
    amount: '',
    revenue_type: 'regular',
    client_name: '',
    product_service_name: '',
    payment_method: 'bank_transfer',
    invoice_ref: '',
    notes: '',
  })

  const { salesEntries, loading: loadingSales, addSalesEntry, deleteSalesEntry } = useSales(formData.project_id || null)

  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(salesEntries.length / ITEMS_PER_PAGE))
  const pagedSales = salesEntries.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'project_id') setCurrentPage(1)
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMsg('')
    setErrorMsg('')

    if (!formData.project_id) {
      setErrorMsg('Sila pilih projek tugasan.')
      return
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setErrorMsg('Sila masukkan jumlah hasil jualan yang sah (lebih dari RM 0).')
      return
    }

    setSubmitting(true)
    const result = await addSalesEntry(formData)
    setSubmitting(false)

    if (result.success) {
      setSuccessMsg('Rekod jualan berjaya disimpan ke dalam sistem!')
      // Reset form keeping date and selected project
      setFormData((prev) => ({
        ...prev,
        amount: '',
        client_name: '',
        product_service_name: '',
        invoice_ref: '',
        notes: '',
      }))
    } else {
      setErrorMsg(`Gagal menyimpan rekod jualan: ${result.error}`)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Adakah anda pasti ingin menghapuskan rekod jualan ini?')) {
      await deleteSalesEntry(id)
    }
  }

  return (
    <MainLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Page Title Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kemasukan Data Hasil / Jualan</h1>
          <p className="text-sm text-slate-500 mt-1">
            Rekodkan hasil jualan projek tugasan anda bagi bulan semasa.
          </p>
        </div>

        {/* Banners */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center shadow-sm">
            <CheckCircle2 className="w-5 h-5 mr-3 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-sm rounded-xl flex items-center shadow-sm">
            <AlertCircle className="w-5 h-5 mr-3 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Panel */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
            <div className="flex items-center mb-6 pb-4 border-b border-slate-100">
              <PlusCircle className="w-5 h-5 text-blue-900 mr-2" />
              <h2 className="text-base font-semibold text-slate-900">Borang Rekod Hasil</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Project Assignment Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Projek Tugasan <span className="text-red-500">*</span>
                </label>
                <select
                  name="project_id"
                  value={formData.project_id}
                  onChange={handleChange}
                  required
                  disabled={loadingProjects}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 focus:border-blue-900 bg-white"
                >
                  <option value="">-- Pilih Projek --</option>
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.name} ({proj.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Revenue Type Radio Pills */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Jenis Hasil <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'regular', label: 'Biasa' },
                    { id: 'recurring', label: 'Berulang' },
                    { id: 'advance_deposit', label: 'Deposit' },
                  ].map((type) => (
                    <label
                      key={type.id}
                      className={`flex items-center justify-center p-2 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                        formData.revenue_type === type.id
                          ? 'border-blue-900 bg-blue-50 text-blue-900 font-semibold'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="revenue_type"
                        value={type.id}
                        checked={formData.revenue_type === type.id}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      {type.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Date & Amount Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tarikh Jualan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="sale_date"
                    value={formData.sale_date}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jumlah (RM) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                  />
                </div>
              </div>

              {/* Client Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Pelanggan / Klien <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleChange}
                  placeholder="Contoh: Syarikat Maju Sdn Bhd"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                />
              </div>

              {/* Product / Service Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Produk / Perkhidmatan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="product_service_name"
                  value={formData.product_service_name}
                  onChange={handleChange}
                  placeholder="Contoh: Pajak Gadai Emas Premium"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                />
              </div>

              {/* Payment Method & Invoice Ref Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kaedah Pembayaran
                  </label>
                  <select
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 focus:border-blue-900 bg-white"
                  >
                    <option value="bank_transfer">Pindahan Bank</option>
                    <option value="cash">Tunai</option>
                    <option value="card">Kad Kredit/Debit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    No. Rujukan Invois
                  </label>
                  <input
                    type="text"
                    name="invoice_ref"
                    value={formData.invoice_ref}
                    onChange={handleChange}
                    placeholder="INV-2026-001"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nota Tambahan
                </label>
                <textarea
                  name="notes"
                  rows="2"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Catatan rujukan tambahan jika ada..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 focus:border-blue-900 resize-none"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50 mt-4"
              >
                {submitting ? 'Menyimpan...' : 'HANTAR REKOD JUALAN'}
              </button>
            </form>
          </div>

          {/* Right Column: History Table Panel */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-blue-900 mr-2" />
                  <h2 className="text-base font-semibold text-slate-900">Rekod Jualan Terbaru</h2>
                </div>
                <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                  {salesEntries.length} Rekod
                </span>

              </div>

              {loadingSales ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-xs text-slate-500">Memuatkan sejarah jualan...</p>
                </div>
              ) : salesEntries.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-600">Tiada rekod jualan ditemui</p>
                  <p className="text-xs text-slate-400 mt-1">Sila isi borang di sebelah untuk merekodkan jualan baharu.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                        <th className="py-3 px-3">Projek</th>
                        <th className="py-3 px-3">Tarikh</th>
                        <th className="py-3 px-3">Produk / Klien</th>
                        <th className="py-3 px-3 text-right">Jumlah (RM)</th>
                        <th className="py-3 px-3 text-center">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {pagedSales.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3 font-semibold text-slate-900">
                            {item.projects?.name}
                            <span className="block text-[10px] text-slate-400 font-normal">
                              {getRevenueTypeLabel(item.revenue_type)}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                            {formatDateBM(item.sale_date)}
                          </td>
                          <td className="py-3 px-3">
                            <p className="font-medium text-slate-800">{item.product_service_name}</p>
                            <p className="text-[10px] text-slate-500">{item.client_name}</p>
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-slate-900 whitespace-nowrap">
                            {formatRM(item.amount)}
                          </td>
                          <td className="py-3 px-3 text-center whitespace-nowrap">
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus Rekod"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* Pagination */}
                  {salesEntries.length > ITEMS_PER_PAGE && (
                    <div className="flex items-center justify-between px-3 py-3 border-t border-slate-100 bg-slate-50/50">
                      <p className="text-[10px] text-slate-500">
                        {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, salesEntries.length)} / {salesEntries.length} rekod
                      </p>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="px-2.5 py-1 text-[10px] font-semibold rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          ←
                        </button>
                        {getPageNumbers(currentPage, totalPages).map((page, idx) =>
                          page === '...' ? (
                            <span key={`ellipsis-${idx}`} className="w-7 h-7 flex items-center justify-center text-[10px] text-slate-400">…</span>
                          ) : (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`w-7 h-7 text-[10px] font-semibold rounded-lg transition-colors ${
                                page === currentPage
                                  ? 'bg-blue-900 text-white'
                                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {page}
                            </button>
                          )
                        )}
                        <button
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="px-2.5 py-1 text-[10px] font-semibold rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
