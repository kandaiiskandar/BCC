/**
 * Formats a numeric value into Malaysian Ringgit (RM) format.
 * Example: 15500.5 -> "RM 15,500.50"
 */
export function formatRM(value) {
  if (value === null || value === undefined || isNaN(value)) {
    return 'RM 0.00'
  }
  return new Intl.NumberFormat('ms-MY', {
    style: 'currency',
    currency: 'MYR'
  }).format(value).replace('MYR', 'RM')
}

/**
 * Formats an ISO Date string into Bahasa Malaysia long date format.
 * Example: "2026-07-26" -> "26 Julai 2026"
 */
export function formatDateBM(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString

  const monthsBM = [
    'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
    'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'
  ]

  const day = date.getDate()
  const month = monthsBM[date.getMonth()]
  const year = date.getFullYear()

  return `${day} ${month} ${year}`
}

/**
 * Maps database revenue_type ENUM values to Bahasa Malaysia labels.
 */
export function getRevenueTypeLabel(type) {
  switch (type) {
    case 'regular':
      return 'Jualan Biasa'
    case 'recurring':
      return 'Hasil Berulang'
    case 'advance_deposit':
      return 'Bayaran Pendahuluan / Deposit'
    default:
      return type
  }
}

/**
 * Maps database expense_category ENUM values to Bahasa Malaysia labels.
 */
export function getExpenseCategoryLabel(category) {
  switch (category) {
    case 'salaries_wages':          return 'Gaji dan Upah Kakitangan'
    case 'marketing_advertising':   return 'Kos Pemasaran dan Pengiklanan'
    case 'daily_operations':        return 'Kos Operasi Harian'
    case 'supplier_raw_materials':  return 'Kos Pembekal / Bahan Mentah'
    case 'rent':                    return 'Sewa Premis'
    case 'utilities':               return 'Utiliti (Elektrik, Air, Internet)'
    case 'sales_commission':        return 'Komisen Jualan'
    case 'travel_transport':        return 'Perjalanan dan Pengangkutan'
    case 'equipment_tech':          return 'Peralatan dan Teknologi'
    case 'others':                  return 'Lain-lain'
    default:                        return category
  }
}

/**
 * Maps expense_status ENUM to badge config { label, classes }.
 */
export function getExpenseStatusBadge(status) {
  switch (status) {
    case 'pending':
      return { label: '⏳ Menunggu Kelulusan', classes: 'bg-yellow-100 text-yellow-800 border border-yellow-200' }
    case 'approved':
      return { label: '🟢 Diluluskan', classes: 'bg-emerald-100 text-emerald-800 border border-emerald-200' }
    case 'rejected':
      return { label: '🔴 Ditolak', classes: 'bg-red-100 text-red-800 border border-red-200' }
    default:
      return { label: status, classes: 'bg-slate-100 text-slate-600' }
  }
}

/**
 * Maps database payment_method ENUM values to Bahasa Malaysia labels.
 */
export function getPaymentMethodLabel(method) {
  switch (method) {
    case 'cash':
      return 'Tunai'
    case 'bank_transfer':
      return 'Pindahan Bank'
    case 'card':
      return 'Kad Kredit/Debit'
    default:
      return method
  }
}
