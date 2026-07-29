import { useState, useCallback } from 'react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'

// Generates last 12 months as array of { year, month, label }
function getLast12Months() {
  const months = []
  const now = new Date()
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      label: d.toLocaleDateString('ms-MY', { month: 'short', year: '2-digit' }),
    })
  }
  return months
}

export function useProjectDetail() {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)
  const { user } = useAuth()

  const fetchDetail = useCallback(async (projectId) => {
    if (!user || !projectId) return
    setLoading(true)
    setDetail(null)
    setError(null)

    const months   = getLast12Months()
    const startDate = `${months[0].year}-${String(months[0].month).padStart(2, '0')}-01`

    try {
      const [
        { data: salesRaw,     error: e1 },
        { data: recentSales,  error: e2 },
        { data: recentExpenses, error: e3 },
      ] = await Promise.all([
        // All sales for this project in the last 12 months (for trend chart)
        supabase
          .from('sales_entries')
          .select('sale_date, amount')
          .eq('project_id', projectId)
          .gte('sale_date', startDate)
          .order('sale_date'),

        // 10 most recent sales entries
        supabase
          .from('sales_entries')
          .select('id, sale_date, amount, revenue_type, client_name, payment_method')
          .eq('project_id', projectId)
          .order('sale_date', { ascending: false })
          .limit(10),

        // 10 most recent approved expenses
        supabase
          .from('expense_entries')
          .select('id, expense_date, amount, category, description, status')
          .eq('project_id', projectId)
          .eq('status', 'approved')
          .order('expense_date', { ascending: false })
          .limit(10),
      ])

      if (e1) throw e1
      if (e2) throw e2
      if (e3) throw e3

      // Aggregate raw sales by month for the trend bar chart
      const monthlyTrend = months.map((m) => {
        const total = (salesRaw || [])
          .filter((s) => {
            const d = new Date(s.sale_date)
            return (
              d.getFullYear() === m.year &&
              d.getMonth() + 1 === m.month
            )
          })
          .reduce((sum, s) => sum + parseFloat(s.amount || 0), 0)
        return { label: m.label, sales: total }
      })

      // Summary totals for the mini KPI strip
      const totalSales    = (recentSales || []).reduce((s, r) => s + parseFloat(r.amount || 0), 0)
      const totalExpenses = (recentExpenses || []).reduce((s, r) => s + parseFloat(r.amount || 0), 0)

      setDetail({
        monthlyTrend,
        recentSales:    recentSales    || [],
        recentExpenses: recentExpenses || [],
        totalSalesLast10:    totalSales,
        totalExpensesLast10: totalExpenses,
      })
    } catch (err) {
      console.error('useProjectDetail error:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  const clearDetail = useCallback(() => {
    setDetail(null)
    setError(null)
  }, [])

  return { detail, loading, error, fetchDetail, clearDetail }
}
