import { useState, useCallback } from 'react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'

// Returns { startDate, endDate, label } for a given filter + year/month/quarter
export function getReportDateRange(filter, year, month, quarter) {
  const y = parseInt(year)

  switch (filter) {
    case 'month': {
      const m = parseInt(month)
      const lastDay = new Date(y, m, 0).getDate()
      return {
        startDate: `${y}-${String(m).padStart(2, '0')}-01`,
        endDate:   `${y}-${String(m).padStart(2, '0')}-${lastDay}`,
        label:     new Date(y, m - 1, 1).toLocaleDateString('ms-MY', { month: 'long', year: 'numeric' }),
      }
    }
    case 'quarter': {
      const q = parseInt(quarter)
      const startMonth = (q - 1) * 3 + 1
      const endMonth   = q * 3
      const lastDay    = new Date(y, endMonth, 0).getDate()
      return {
        startDate: `${y}-${String(startMonth).padStart(2, '0')}-01`,
        endDate:   `${y}-${String(endMonth).padStart(2, '0')}-${lastDay}`,
        label:     `S${q} ${y} (${new Date(y, startMonth - 1).toLocaleDateString('ms-MY', { month: 'short' })}–${new Date(y, endMonth - 1).toLocaleDateString('ms-MY', { month: 'short' })})`,
      }
    }
    case 'ytd':
    default: {
      const now = new Date()
      const endM = y === now.getFullYear() ? now.getMonth() + 1 : 12
      const lastDay = new Date(y, endM, 0).getDate()
      return {
        startDate: `${y}-01-01`,
        endDate:   `${y}-${String(endM).padStart(2, '0')}-${lastDay}`,
        label:     `Jan–${new Date(y, endM - 1).toLocaleDateString('ms-MY', { month: 'short' })} ${y} (YTD)`,
      }
    }
  }
}

export function useReports() {
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  const fetchReport = useCallback(async (filter, year, month, quarter) => {
    if (!user) return
    try {
      setLoading(true)
      setError(null)
      setReportData(null)

      const { startDate, endDate, label } = getReportDateRange(filter, year, month, quarter)
      const y = parseInt(year)

      const [
        { data: salesRaw, error: e1 },
        { data: expensesRaw, error: e2 },
        { data: projects, error: e3 },
        { data: targets, error: e4 },
      ] = await Promise.all([
        supabase
          .from('sales_entries')
          .select('id, sale_date, amount, revenue_type, client_name, product_service_name, payment_method, invoice_ref, notes, project_id, projects(name, code), profiles!created_by(full_name)')
          .gte('sale_date', startDate)
          .lte('sale_date', endDate)
          .order('sale_date', { ascending: true }),
        supabase
          .from('expense_entries')
          .select('id, expense_date, amount, category, description, status, rejection_reason, project_id, projects(name, code), profiles!created_by(full_name)')
          .eq('status', 'approved')
          .gte('expense_date', startDate)
          .lte('expense_date', endDate)
          .order('expense_date', { ascending: true }),
        supabase
          .from('projects')
          .select('id, name, code, industry')
          .eq('is_active', true)
          .order('name'),
        supabase
          .from('project_targets')
          .select('project_id, target_revenue, target_profit_margin, year, month')
          .eq('year', y),
      ])

      if (e1) throw e1
      if (e2) throw e2
      if (e3) throw e3
      if (e4) throw e4

      // Build target map (prefer month-specific over annual)
      const targetMap = {}
      ;(targets || []).forEach((t) => {
        if (!targetMap[t.project_id] || t.month != null) {
          targetMap[t.project_id] = t
        }
      })

      // Aggregate per project
      const salesByProject = {}
      ;(salesRaw || []).forEach((s) => {
        salesByProject[s.project_id] = (salesByProject[s.project_id] || 0) + parseFloat(s.amount || 0)
      })

      const expensesByProject = {}
      ;(expensesRaw || []).forEach((e) => {
        expensesByProject[e.project_id] = (expensesByProject[e.project_id] || 0) + parseFloat(e.amount || 0)
      })

      const summary = (projects || []).map((proj) => {
        const sales    = salesByProject[proj.id]    || 0
        const expenses = expensesByProject[proj.id] || 0
        const profit   = sales - expenses
        const target   = targetMap[proj.id]
        const targetRevenue = target?.target_revenue || 0
        const targetPct = targetRevenue > 0 ? (sales / targetRevenue) * 100 : null

        let status = '⚪ Tiada Sasaran'
        if (targetPct !== null) {
          if (targetPct >= 100) status = '🟢 Mencapai Sasaran'
          else if (targetPct >= 80) status = '🟡 Hampir Sasaran'
          else status = '🔴 Di Bawah Sasaran'
        }

        return { ...proj, sales, expenses, profit, targetRevenue, targetPct, status }
      })

      const totals = {
        sales:    summary.reduce((a, p) => a + p.sales, 0),
        expenses: summary.reduce((a, p) => a + p.expenses, 0),
        profit:   summary.reduce((a, p) => a + p.profit, 0),
      }

      setReportData({
        label,
        startDate,
        endDate,
        summary,
        totals,
        salesRaw:    salesRaw    || [],
        expensesRaw: expensesRaw || [],
      })
    } catch (err) {
      console.error('Error fetching report data:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  return { reportData, loading, error, fetchReport }
}
