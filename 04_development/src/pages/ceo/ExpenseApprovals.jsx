import React, { useState } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import { useExpenses } from '../../hooks/useExpenses'
import {
  formatRM,
  formatDateBM,
  getExpenseCategoryLabel,
  getExpenseStatusBadge,
} from '../../utils/formatters'
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  X,
  FileText,
} from 'lucide-react'

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

export default function ExpenseApprovals() {
  const { expenses, loading, approveExpense, rejectExpense, getReceiptSignedUrl } = useExpenses()

  const [selectedExpense, setSelectedExpense] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [receiptUrl, setReceiptUrl] = useState(null)
  const [loadingReceipt, setLoadingReceipt] = useState(false)
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' })
  const [statusFilter, setStatusFilter] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const pendingCount = expenses.filter((e) => e.status === 'pending').length

  // Filter
  const filteredExpenses = statusFilter
    ? expenses.filter((e) => e.status === statusFilter)
    : expenses

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE))
  const pagedExpenses = filteredExpenses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleFilterChange = (filter) => {
    setStatusFilter(filter)
    setCurrentPage(1)
  }

  const openModal = async (expense) => {
    setSelectedExpense(expense)
    setRejectionReason('')
    setShowRejectForm(false)
    setActionMsg({ type: '', text: '' })
    setReceiptUrl(null)

    if (expense.receipt_url) {
      setLoadingReceipt(true)
      const url = await getReceiptSignedUrl(expense.receipt_url)
      setReceiptUrl(url)
      setLoadingReceipt(false)
    }
  }

  const closeModal = () => {
    setSelectedExpense(null)
    setRejectionReason('')
    setShowRejectForm(false)
    setActionMsg({ type: '', text: '' })
    setReceiptUrl(null)
  }

  const handleApprove = async () => {
    if (!selectedExpense) return
    setProcessing(true)
    const result = await approveExpense(selectedExpense.id)
    setProcessing(false)

    if (result.success) {
      setActionMsg({ type: 'success', text: `Perbelanjaan ${formatRM(selectedExpense.amount)} berjaya diluluskan.` })
      setTimeout(closeModal, 1500)
    } else {
      setActionMsg({ type: 'error', text: `Ralat: ${result.error}` })
    }
  }

  const handleReject = async () => {
    if (!selectedExpense) return
    if (!rejectionReason.trim()) {
      setActionMsg({ type: 'error', text: 'Alasan penolakan wajib diisi sebelum menolak tuntutan.' })
      return
    }
    setProcessing(true)
    const result = await rejectExpense(selectedExpense.id, rejectionReason)
    setProcessing(false)

    if (result.success) {
      setActionMsg({ type: 'success', text: 'Tuntutan telah ditolak. PM akan menerima makluman.' })
      setTimeout(closeModal, 1500)
    } else {
      setActionMsg({ type: 'error', text: `Ralat: ${result.error}` })
    }
  }

  const isReceiptImage = (path) => {
    if (!path) return false
    const ext = path.split('.').pop().toLowerCase()
    return ['png', 'jpg', 'jpeg'].includes(ext)
  }

  return (
    <MainLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Kelulusan Perbelanjaan</h1>
            <p className="text-sm text-slate-500 mt-1">
              Semak, luluskan, atau tolak tuntutan perbelanjaan yang dikemukakan oleh Pengurus Projek.
            </p>
          </div>
          {pendingCount > 0 && (
            <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm font-semibold px-4 py-2 rounded-xl shadow-sm">
              <Clock className="w-4 h-4" />
              {pendingCount} tuntutan menunggu kelulusan
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Semua', filter: null, count: expenses.length, active: 'bg-slate-800 text-white border-slate-800', inactive: 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50' },
            { label: '⏳ Menunggu', filter: 'pending', count: expenses.filter((e) => e.status === 'pending').length, active: 'bg-yellow-500 text-white border-yellow-500', inactive: 'bg-white text-yellow-700 border-yellow-300 hover:bg-yellow-50' },
            { label: '🟢 Diluluskan', filter: 'approved', count: expenses.filter((e) => e.status === 'approved').length, active: 'bg-emerald-600 text-white border-emerald-600', inactive: 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50' },
            { label: '🔴 Ditolak', filter: 'rejected', count: expenses.filter((e) => e.status === 'rejected').length, active: 'bg-red-600 text-white border-red-600', inactive: 'bg-white text-red-700 border-red-300 hover:bg-red-50' },
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={() => handleFilterChange(tab.filter)}
              className={`text-xs font-semibold px-4 py-1.5 rounded-full border transition-colors ${statusFilter === tab.filter ? tab.active : tab.inactive}`}
            >
              {tab.label} <span className="ml-1 opacity-75">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Expense Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs text-slate-500">Memuatkan senarai tuntutan perbelanjaan...</p>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="text-center py-16">
              <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-600">Tiada tuntutan dalam kategori ini</p>
              <p className="text-xs text-slate-400 mt-1">Cuba tukar penapis di atas untuk lihat rekod lain.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">
                  <th className="py-4 px-5">Projek / PM</th>
                  <th className="py-4 px-5">Tarikh</th>
                  <th className="py-4 px-5">Kategori & Penerangan</th>
                  <th className="py-4 px-5 text-right">Jumlah (RM)</th>
                  <th className="py-4 px-5 text-center">Status</th>
                  <th className="py-4 px-5 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {pagedExpenses.map((item) => {
                  const badge = getExpenseStatusBadge(item.status)
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-5">
                        <p className="font-semibold text-slate-900">{item.projects?.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {item.profiles?.full_name || 'Pengurus Projek'}
                        </p>
                      </td>
                      <td className="py-4 px-5 text-slate-600 whitespace-nowrap text-xs">
                        {formatDateBM(item.expense_date)}
                      </td>
                      <td className="py-4 px-5 max-w-xs">
                        <p className="font-medium text-slate-800 text-xs">
                          {getExpenseCategoryLabel(item.category)}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5" title={item.description}>
                          {item.description}
                        </p>
                        {item.status === 'rejected' && item.rejection_reason && (
                          <p className="text-[10px] text-red-600 mt-0.5 italic">
                            Alasan: {item.rejection_reason}
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-5 text-right font-bold text-slate-900 whitespace-nowrap">
                        {formatRM(item.amount)}
                      </td>
                      <td className="py-4 px-5 text-center">
                        <span className={`inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full ${badge.classes}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <button
                          onClick={() => openModal(item)}
                          className="text-xs font-semibold text-blue-900 hover:underline px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors border border-blue-200"
                        >
                          Semak
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {filteredExpenses.length > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-slate-50/50">
              <p className="text-xs text-slate-500">
                Menunjukkan {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredExpenses.length)} daripada {filteredExpenses.length} rekod
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Sebelum
                </button>
                {getPageNumbers(currentPage, totalPages).map((page, idx) =>
                  page === '...' ? (
                    <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-xs text-slate-400">…</span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 text-xs font-semibold rounded-lg transition-colors ${
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
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Seterus →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Approval Modal */}
      {selectedExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
              <div>
                <h3 className="text-base font-bold text-slate-900">Semakan Tuntutan Perbelanjaan</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedExpense.projects?.name} · {formatDateBM(selectedExpense.expense_date)} ·{' '}
                  {selectedExpense.profiles?.full_name}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Expense Details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Maklumat Tuntutan</h4>

                  <div className="bg-slate-50 rounded-xl p-4 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-xs">Projek</span>
                      <span className="font-semibold text-slate-900 text-xs">{selectedExpense.projects?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-xs">Pengurus Projek</span>
                      <span className="font-semibold text-slate-900 text-xs">{selectedExpense.profiles?.full_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-xs">Tarikh</span>
                      <span className="font-semibold text-slate-900 text-xs">{formatDateBM(selectedExpense.expense_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-xs">Kategori</span>
                      <span className="font-semibold text-slate-900 text-xs text-right max-w-[55%]">
                        {getExpenseCategoryLabel(selectedExpense.category)}
                      </span>
                    </div>
                    <div className="border-t border-slate-200 pt-3 flex justify-between">
                      <span className="text-slate-600 text-xs font-semibold">Jumlah Tuntutan</span>
                      <span className="font-bold text-slate-900 text-base">{formatRM(selectedExpense.amount)}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-1">Penerangan</p>
                    <p className="text-sm text-slate-800 bg-slate-50 rounded-lg p-3 leading-relaxed">
                      {selectedExpense.description}
                    </p>
                  </div>

                  {/* Status badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Status semasa:</span>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${getExpenseStatusBadge(selectedExpense.status).classes}`}>
                      {getExpenseStatusBadge(selectedExpense.status).label}
                    </span>
                  </div>
                </div>

                {/* Right: Receipt Preview */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dokumen Resit Sokongan</h4>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 min-h-[200px] flex flex-col items-center justify-center">
                    {!selectedExpense.receipt_url ? (
                      <>
                        <FileText className="w-10 h-10 text-slate-300 mb-2" />
                        <p className="text-xs text-slate-500 text-center">Tiada dokumen resit dimuat naik untuk tuntutan ini.</p>
                      </>
                    ) : loadingReceipt ? (
                      <div className="text-center">
                        <div className="w-6 h-6 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-xs text-slate-500">Memuatkan dokumen resit...</p>
                      </div>
                    ) : receiptUrl ? (
                      <>
                        {isReceiptImage(selectedExpense.receipt_url) ? (
                          <img
                            src={receiptUrl}
                            alt="Resit"
                            className="max-h-48 rounded-lg object-contain shadow"
                          />
                        ) : (
                          <div className="text-center">
                            <FileText className="w-10 h-10 text-blue-300 mb-2 mx-auto" />
                            <p className="text-xs text-slate-600 mb-3">Dokumen PDF tersedia</p>
                          </div>
                        )}
                        <a
                          href={receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Buka / Muat Turun Dokumen Penuh
                        </a>
                      </>
                    ) : (
                      <p className="text-xs text-red-500 text-center">Gagal memuatkan pautan dokumen resit. Sila cuba lagi.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Message */}
              {actionMsg.text && (
                <div className={`mt-4 p-3 rounded-lg flex items-center text-sm ${
                  actionMsg.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  {actionMsg.type === 'success'
                    ? <CheckCircle2 className="w-4 h-4 mr-2 shrink-0" />
                    : <AlertCircle className="w-4 h-4 mr-2 shrink-0" />}
                  {actionMsg.text}
                </div>
              )}

              {/* Rejection Reason Input */}
              {showRejectForm && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <label className="block text-xs font-semibold text-red-800 mb-2">
                    Alasan Penolakan <span className="text-red-500">*</span> (wajib diisi)
                  </label>
                  <textarea
                    rows="3"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Contoh: Resit tidak jelas. Sila muat naik fail beresolusi tinggi."
                    className="w-full px-3 py-2 border border-red-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none bg-white"
                  />
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={handleReject}
                      disabled={processing}
                      className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-50"
                    >
                      {processing ? 'Memproses...' : '❌ Sahkan Penolakan'}
                    </button>
                    <button
                      onClick={() => { setShowRejectForm(false); setRejectionReason('') }}
                      className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            {selectedExpense.status === 'pending' && !showRejectForm && (
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex gap-3 shrink-0">
                <button
                  onClick={handleApprove}
                  disabled={processing}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {processing ? 'Memproses...' : '✅ Luluskan Perbelanjaan'}
                </button>
                <button
                  onClick={() => setShowRejectForm(true)}
                  disabled={processing}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  ❌ Tolak Perbelanjaan
                </button>
              </div>
            )}

            {selectedExpense.status !== 'pending' && (
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 shrink-0">
                <p className="text-xs text-slate-500 text-center">
                  Tuntutan ini telah diproses. Status tidak boleh diubah semula.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </MainLayout>
  )
}
