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
