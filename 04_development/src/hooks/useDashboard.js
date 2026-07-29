import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'

// Returns start/end date strings for current and previous period
function getDateRanges(filter) {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth() // 0-indexed

  let startDate, endDate, prevStartDate, prevEndDate, year, month

  switch (filter) {
    case 'last_month': {
      const d = new Date(y, m - 1, 1)
      startDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
      endDate = `${y}-${String(m).padStart(2, '0')}-${new Date(y, m, 0).getDate()}`
      const pd = new Date(y, m - 2, 1)
      prevStartDate = `${pd.getFullYear()}-${String(pd.getMonth() + 1).padStart(2, '0')}-01`
      prevEndDate = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}-${new Date(d.getFullYear(), d.getMonth(), 0).getDate()}`
      year = d.getFullYear()
      month = d.getMonth() + 1
      break
    }
    case 'quarter': {
      const qStart = new Date(y, m - 2, 1)
      startDate = `${qStart.getFullYear()}-${String(qStart.getMonth() + 1).padStart(2, '0')}-01`
      endDate = `${y}-${String(m + 1).padStart(2, '0')}-${new Date(y, m + 1, 0).getDate()}`
      const pqStart = new Date(y, m - 5, 1)
      const pqEnd = new Date(y, m - 2, 0)
      prevStartDate = `${pqStart.getFullYear()}-${String(pqStart.getMonth() + 1).padStart(2, '0')}-01`
      prevEndDate = `${pqEnd.getFullYear()}-${String(pqEnd.getMonth() + 1).padStart(2, '0')}-${pqEnd.getDate()}`
      year = y
      month = null
      break
    }
    case 'ytd': {
      startDate = `${y}-01-01`
      endDate = `${y}-${String(m + 1).padStart(2, '0')}-${new Date(y, m + 1, 0).getDate()}`
      prevStartDate = `${y - 1}-01-01`
      prevEndDate = `${y - 1}-${String(m + 1).padStart(2, '0')}-${new Date(y - 1, m + 1, 0).getDate()}`
      year = y
      month = null
      break
    }
    default: { // current_month
      startDate = `${y}-${String(m + 1).padStart(2, '0')}-01`
      endDate = `${y}-${String(m + 1).padStart(2, '0')}-${new Date(y, m + 1, 0).getDate()}`
      const pm = m === 0 ? 11 : m - 1
      const py = m === 0 ? y - 1 : y
      prevStartDate = `${py}-${String(pm + 1).padStart(2, '0')}-01`
      prevEndDate = `${py}-${String(pm + 1).padStart(2, '0')}-${new Date(py, pm + 1, 0).getDate()}`
      year = y
      month = m + 1
      break
    }
  }

  return { startDate, endDate, prevStartDate, prevEndDate, year, month }
}

// Generate last 12 month labels + start dates for trend chart
function getLast12Months() {
  const months = []
  const now = new Date()
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('ms-MY', { month: 'short', year: '2-digit' }),
      start: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`,
      end: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()}`,
    })
  }
  return months
}

function sumAmount(arr) {
  return (arr || []).reduce((acc, r) => acc + parseFloat(r.amount || 0), 0)
}

function pctChange(current, previous) {
  if (!previous || previous === 0) return null
  return ((current - previous) / previous) * 100
}

export function useDashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dateFilter, setDateFilter] = useState('current_month')
  const { user } = useAuth()

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { startDate, endDate, prevStartDate, prevEndDate, year, month } = getDateRanges(dateFilter)
      const last12 = getLast12Months()
      const trend12Start = last12[0].start

      // Run all queries in parallel
      const [
        { data: salesCurrent },
        { data: salesPrev },
        { data: expensesCurrent },
        { data: expensesPrev },
        { data: projects },
        { data: targets },
        { data: salesTrend },
        { data: pendingExpenses },
      ] = await Promise.all([
        supabase
          .from('sales_entries')
          .select('amount, project_id, projects(name, code, industry)')
          .gte('sale_date', startDate)
          .lte('sale_date', endDate),
        supabase
          .from('sales_entries')
          .select('amount')
          .gte('sale_date', prevStartDate)
          .lte('sale_date', prevEndDate),
        supabase
          .from('expense_entries')
          .select('amount, project_id')
          .eq('status', 'approved')
          .gte('expense_date', startDate)
          .lte('expense_date', endDate),
        supabase
          .from('expense_entries')
          .select('amount')
          .eq('status', 'approved')
          .gte('expense_date', prevStartDate)
          .lte('expense_date', prevEndDate),
        supabase
          .from('projects')
          .select('id, name, code, industry')
          .eq('is_active', true)
          .order('name'),
        supabase
          .from('project_targets')
          .select('project_id, target_revenue, target_profit_margin, year, month')
          .eq('year', year),
        supabase
          .from('sales_entries')
          .select('sale_date, amount')
          .gte('sale_date', trend12Start),
        supabase
          .from('expense_entries')
          .select('id')
          .eq('status', 'pending'),
      ])

      // --- KPI Calculations ---
      const totalSales = sumAmount(salesCurrent)
      const totalSalesPrev = sumAmount(salesPrev)
      const totalExpenses = sumAmount(expensesCurrent)
      const totalExpensesPrev = sumAmount(expensesPrev)
      const netProfit = totalSales - totalExpenses
      const netProfitPrev = totalSalesPrev - totalExpensesPrev
      const marginPct = totalSales > 0 ? (netProfit / totalSales) * 100 : 0

      // --- Project Stats (table) ---
      const targetMap = {}
      ;(targets || []).forEach((t) => {
        // Use month-specific target if available, else annual
        if (!targetMap[t.project_id] || t.month === month) {
          targetMap[t.project_id] = t
        }
      })

      const salesByProject = {}
      ;(salesCurrent || []).forEach((s) => {
        salesByProject[s.project_id] = (salesByProject[s.project_id] || 0) + parseFloat(s.amount || 0)
      })

      const expensesByProject = {}
      ;(expensesCurrent || []).forEach((e) => {
        expensesByProject[e.project_id] = (expensesByProject[e.project_id] || 0) + parseFloat(e.amount || 0)
      })

      const projectStats = (projects || []).map((proj) => {
        const sales = salesByProject[proj.id] || 0
        const expenses = expensesByProject[proj.id] || 0
        const profit = sales - expenses
        const target = targetMap[proj.id]
        const targetRevenue = target?.target_revenue || 0
        const targetPct = targetRevenue > 0 ? (sales / targetRevenue) * 100 : null

        let statusFlag = '⚪'
        if (targetPct !== null) {
          if (targetPct >= 100) statusFlag = '🟢'
          else if (targetPct >= 80) statusFlag = '🟡'
          else statusFlag = '🔴'
        }

        return {
          id: proj.id,
          name: proj.name,
          code: proj.code,
          industry: proj.industry,
          sales,
          expenses,
          profit,
          targetRevenue,
          targetPct,
          statusFlag,
        }
      })

      const achievedCount = projectStats.filter((p) => p.targetPct !== null && p.targetPct >= 100).length
      const projectsWithTargets = projectStats.filter((p) => p.targetPct !== null).length

      // --- Monthly Trend (last 12 months bar chart) ---
      const salesByMonth = {}
      ;(salesTrend || []).forEach((s) => {
        const monthKey = s.sale_date.substring(0, 7) // "YYYY-MM"
        salesByMonth[monthKey] = (salesByMonth[monthKey] || 0) + parseFloat(s.amount || 0)
      })

      const monthlyTrend = last12.map((m) => ({
        label: m.label,
        sales: salesByMonth[m.key] || 0,
      }))

      // --- Project Breakdown (donut chart) ---
      const projectBreakdown = (projects || [])
        .map((proj) => ({
          name: proj.name,
          value: salesByProject[proj.id] || 0,
        }))
        .filter((p) => p.value > 0)
        .sort((a, b) => b.value - a.value)

      setDashboardData({
        kpis: {
          totalSales,
          totalSalesPrev,
          salesChange: pctChange(totalSales, totalSalesPrev),
          totalExpenses,
          totalExpensesPrev,
          expensesChange: pctChange(totalExpenses, totalExpensesPrev),
          netProfit,
          netProfitPrev,
          profitChange: pctChange(netProfit, netProfitPrev),
          marginPct,
          achievedCount,
          projectsWithTargets,
          totalProjects: (projects || []).length,
        },
        projectStats,
        monthlyTrend,
        projectBreakdown,
        pendingExpensesCount: (pendingExpenses || []).length,
        period: { startDate, endDate },
      })
    } catch (err) {
      console.error('Error fetching dashboard data:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [dateFilter])

  useEffect(() => {
    if (user) fetchDashboardData()
  }, [user, fetchDashboardData])

  return {
    dashboardData,
    loading,
    error,
    dateFilter,
    setDateFilter,
    refetch: fetchDashboardData,
  }
}
