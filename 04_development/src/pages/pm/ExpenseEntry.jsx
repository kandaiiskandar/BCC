import React, { useState, useRef } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import { useProjects } from '../../hooks/useProjects'
import { useExpenses } from '../../hooks/useExpenses'
import {
  formatRM,
  formatDateBM,
  getExpenseCategoryLabel,
  getExpenseStatusBadge,
} from '../../utils/formatters'
import { PlusCircle, Receipt, CheckCircle2, AlertCircle, Paperclip, X, FileText } from 'lucide-react'

const EXPENSE_CATEGORIES = [
  { value: 'salaries_wages',         label: 'Gaji dan Upah Kakitangan' },
  { value: 'marketing_advertising',  label: 'Kos Pemasaran dan Pengiklanan' },
  { value: 'daily_operations',       label: 'Kos Operasi Harian' },
  { value: 'supplier_raw_materials', label: 'Kos Pembekal / Bahan Mentah' },
  { value: 'rent',                   label: 'Sewa Premis' },
  { value: 'utilities',              label: 'Utiliti (Elektrik, Air, Internet)' },
  { value: 'sales_commission',       label: 'Komisen Jualan' },
  { value: 'travel_transport',       label: 'Perjalanan dan Pengangkutan' },
  { value: 'equipment_tech',         label: 'Peralatan dan Teknologi' },
  { value: 'others',                 label: 'Lain-lain' },
]

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

const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export default function ExpenseEntry() {
  const { projects, loading: loadingProjects } = useProjects()

  const [formData, setFormData] = useState({
    project_id: '',
    expense_date: new Date().toISOString().split('T')[0],
    category: '',
    amount: '',
    description: '',
  })

  const { expenses, loading: loadingExpenses, addExpenseEntry } = useExpenses(formData.project_id || null)

  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(expenses.length / ITEMS_PER_PAGE))
  const pagedExpenses = expenses.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const [receiptFile, setReceiptFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'project_id') setCurrentPage(1)
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Format fail tidak disokong. Sila muat naik fail PDF, PNG, atau JPG sahaja.'
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'Saiz fail melebihi had 5MB. Sila muat naik fail yang lebih kecil.'
    }
    return null
  }

  const handleFileSelect = (file) => {
    if (!file) return
    const err = validateFile(file)
    if (err) {
      setErrorMsg(err)
      return
    }
    setErrorMsg('')
    setReceiptFile(file)
  }

  const handleFileDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFileSelect(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMsg('')
    setErrorMsg('')

    if (!formData.project_id) {
      setErrorMsg('Sila pilih projek tugasan.')
      return
    }
    if (!formData.category) {
      setErrorMsg('Sila pilih kategori perbelanjaan.')
      return
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setErrorMsg('Sila masukkan jumlah perbelanjaan yang sah (lebih dari RM 0).')
      return
    }
    if (!formData.description.trim()) {
      setErrorMsg('Sila masukkan penerangan / huraian perbelanjaan.')
      return
    }

    setSubmitting(true)
    const result = await addExpenseEntry(formData, receiptFile)
    setSubmitting(false)

    if (result.success) {
      setSuccessMsg('Tuntutan perbelanjaan berjaya dihantar dan sedang menunggu kelulusan CEO.')
      setFormData((prev) => ({
        ...prev,
        category: '',
        amount: '',
        description: '',
      }))
      setReceiptFile(null)
    } else {
      setErrorMsg(`Gagal menghantar tuntutan: ${result.error}`)
    }
  }

  return (
    <MainLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kemasukan Perbelanjaan Projek</h1>
          <p className="text-sm text-slate-500 mt-1">
            Rekodkan perbelanjaan projek dan muat naik resit sokongan. Tuntutan memerlukan kelulusan CEO sebelum disahkan.
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
          {/* Left: Entry Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
            <div className="flex items-center mb-6 pb-4 border-b border-slate-100">
              <PlusCircle className="w-5 h-5 text-blue-900 mr-2" />
              <h2 className="text-base font-semibold text-slate-900">Borang Tuntutan Perbelanjaan</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Project Selector */}
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

              {/* Date & Amount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tarikh Perbelanjaan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="expense_date"
                    value={formData.expense_date}
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

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori Perbelanjaan <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 focus:border-blue-900 bg-white"
                >
                  <option value="">-- Pilih Kategori --</option>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Penerangan / Huraian Perbelanjaan <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Contoh: Pembelian simpanan emas sandaran Ar-rahnu bulan Julai 2026..."
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 focus:border-blue-900 resize-none"
                />
              </div>

              {/* Receipt Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dokumen Sokongan / Resit
                </label>
                {receiptFile ? (
                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center min-w-0">
                      <Paperclip className="w-4 h-4 text-blue-700 mr-2 shrink-0" />
                      <span className="text-xs font-medium text-blue-800 truncate">{receiptFile.name}</span>
                      <span className="ml-2 text-[10px] text-blue-500 shrink-0">
                        ({(receiptFile.size / 1024).toFixed(0)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReceiptFile(null)}
                      className="ml-2 p-1 text-blue-400 hover:text-red-500 transition-colors shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors ${
                      isDragging
                        ? 'border-blue-900 bg-blue-50'
                        : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                    }`}
                  >
                    <Paperclip className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-600 font-medium">Seret & Lepas fail resit di sini</p>
                    <p className="text-[10px] text-slate-400 mt-1">atau klik untuk pilih fail (PDF, PNG, JPG — maks 5MB)</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e.target.files[0])}
                    />
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50 mt-2"
              >
                {submitting ? 'Menghantar...' : 'HANTAR UNTUK KELULUSAN CEO'}
              </button>
            </form>
          </div>

          {/* Right: Submission Log */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center">
                <Receipt className="w-5 h-5 text-blue-900 mr-2" />
                <h2 className="text-base font-semibold text-slate-900">Log Status Tuntutan</h2>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-semibold">
                <span className="bg-yellow-100 text-yellow-800 border border-yellow-200 px-2 py-0.5 rounded-full">
                  ⏳ {expenses.filter((e) => e.status === 'pending').length} Menunggu
                </span>
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                  🟢 {expenses.filter((e) => e.status === 'approved').length} Lulus
                </span>
                <span className="bg-red-100 text-red-800 border border-red-200 px-2 py-0.5 rounded-full">
                  🔴 {expenses.filter((e) => e.status === 'rejected').length} Tolak
                </span>
                <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full">
                  {expenses.length} Jumlah
                </span>
              </div>
            </div>

            {loadingExpenses ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-xs text-slate-500">Memuatkan senarai tuntutan...</p>
              </div>
            ) : expenses.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">Tiada tuntutan perbelanjaan ditemui</p>
                <p className="text-xs text-slate-400 mt-1">Sila isi borang di sebelah untuk menghantar tuntutan baharu.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                      <th className="py-3 px-3">Projek</th>
                      <th className="py-3 px-3">Tarikh</th>
                      <th className="py-3 px-3">Kategori</th>
                      <th className="py-3 px-3 text-right">Jumlah (RM)</th>
                      <th className="py-3 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {pagedExpenses.map((item) => {
                      const badge = getExpenseStatusBadge(item.status)
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3 font-semibold text-slate-900">
                            {item.projects?.name}
                            <span className="block text-[10px] text-slate-400 font-normal">
                              {item.projects?.code}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                            {formatDateBM(item.expense_date)}
                          </td>
                          <td className="py-3 px-3">
                            <p className="font-medium text-slate-800">
                              {getExpenseCategoryLabel(item.category)}
                            </p>
                            {item.description && (
                              <p className="text-[10px] text-slate-400 truncate max-w-[160px]" title={item.description}>
                                {item.description}
                              </p>
                            )}
                            {item.status === 'rejected' && item.rejection_reason && (
                              <p className="text-[10px] text-red-600 mt-0.5 italic">
                                Alasan: {item.rejection_reason}
                              </p>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-slate-900 whitespace-nowrap">
                            {formatRM(item.amount)}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className={`inline-block text-[10px] font-semibold px-2 py-1 rounded-full ${badge.classes}`}>
                              {badge.label}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {/* Pagination */}
                {expenses.length > ITEMS_PER_PAGE && (
                  <div className="flex items-center justify-between px-3 py-3 border-t border-slate-100 bg-slate-50/50">
                    <p className="text-[10px] text-slate-500">
                      {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, expenses.length)} / {expenses.length} rekod
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
    </MainLayout>
  )
}
