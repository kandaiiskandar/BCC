import { useState, useCallback } from 'react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'

export function useTargets() {
  const [targets, setTargets] = useState([])   // existing targets from DB
  const [projects, setProjects] = useState([]) // all active projects
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user, profile } = useAuth()

  // Fetch all active projects + existing targets for a given year/month
  const fetchTargets = useCallback(async (year, month) => {
    if (!user) return
    try {
      setLoading(true)
      setError(null)

      const [
        { data: projectsData, error: e1 },
        { data: targetsData, error: e2 },
      ] = await Promise.all([
        supabase
          .from('projects')
          .select('id, name, code, industry')
          .eq('is_active', true)
          .order('name'),
        supabase
          .from('project_targets')
          .select('id, project_id, target_revenue, target_profit_margin, updated_at, profiles!created_by(full_name)')
          .eq('year', year)
          .eq('month', month),
      ])

      if (e1) throw e1
      if (e2) throw e2

      setProjects(projectsData || [])
      setTargets(targetsData || [])
    } catch (err) {
      console.error('Error fetching targets:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Upsert targets for all projects in one batch
  // rows: [{ project_id, target_revenue, target_profit_margin }]
  async function saveTargets(year, month, rows) {
    try {
      const payload = rows.map((r) => ({
        tenant_id: profile.tenant_id,
        project_id: r.project_id,
        year: parseInt(year),
        month: parseInt(month),
        target_revenue: parseFloat(r.target_revenue) || 0,
        target_profit_margin: parseFloat(r.target_profit_margin) || 0,
        created_by: user.id,
      }))

      const { data, error } = await supabase
        .from('project_targets')
        .upsert(payload, { onConflict: 'tenant_id,project_id,year,month' })
        .select('id, project_id, target_revenue, target_profit_margin, updated_at, profiles!created_by(full_name)')

      if (error) throw error

      setTargets(data || [])
      return { success: true }
    } catch (err) {
      console.error('Error saving targets:', err.message)
      return { success: false, error: err.message }
    }
  }

  return { targets, projects, loading, error, fetchTargets, saveTargets }
}
