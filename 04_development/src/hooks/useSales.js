import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'

export function useSales(selectedProjectId = null) {
  const [salesEntries, setSalesEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user, profile } = useAuth()

  const fetchSalesEntries = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('sales_entries')
        .select('*, projects(name, code)')
        .order('sale_date', { ascending: false })

      if (selectedProjectId) {
        query = query.eq('project_id', selectedProjectId)
      }

      const { data, error } = await query

      if (error) throw error
      setSalesEntries(data || [])
    } catch (err) {
      console.error('Error fetching sales entries:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [selectedProjectId])

  useEffect(() => {
    if (user) {
      fetchSalesEntries()
    }
  }, [user, fetchSalesEntries])

  async function addSalesEntry(salesData) {
    try {
      setError(null)
      const payload = {
        tenant_id: profile.tenant_id,
        project_id: salesData.project_id,
        created_by: user.id,
        sale_date: salesData.sale_date,
        amount: parseFloat(salesData.amount),
        revenue_type: salesData.revenue_type || 'regular',
        client_name: salesData.client_name,
        product_service_name: salesData.product_service_name,
        payment_method: salesData.payment_method || 'bank_transfer',
        invoice_ref: salesData.invoice_ref || null,
        notes: salesData.notes || null,
      }

      const { data, error } = await supabase
        .from('sales_entries')
        .insert([payload])
        .select('*, projects(name, code)')
        .single()

      if (error) throw error

      setSalesEntries((prev) => [data, ...prev])
      return { success: true, data }
    } catch (err) {
      console.error('Error adding sales entry:', err.message)
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  async function deleteSalesEntry(id) {
    try {
      setError(null)
      const { error } = await supabase
        .from('sales_entries')
        .delete()
        .eq('id', id)

      if (error) throw error

      setSalesEntries((prev) => prev.filter((item) => item.id !== id))
      return { success: true }
    } catch (err) {
      console.error('Error deleting sales entry:', err.message)
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  return {
    salesEntries,
    loading,
    error,
    addSalesEntry,
    deleteSalesEntry,
    refetch: fetchSalesEntries,
  }
}
