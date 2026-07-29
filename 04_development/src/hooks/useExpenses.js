import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'

export function useExpenses(selectedProjectId = null) {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user, profile } = useAuth()

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('expense_entries')
        .select('*, projects(name, code), profiles!created_by(full_name)')
        .order('expense_date', { ascending: false })

      if (selectedProjectId) {
        query = query.eq('project_id', selectedProjectId)
      }

      const { data, error } = await query
      if (error) throw error
      setExpenses(data || [])
    } catch (err) {
      console.error('Error fetching expense entries:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [selectedProjectId])

  useEffect(() => {
    if (user) fetchExpenses()
  }, [user, fetchExpenses])

  // Upload receipt to Supabase Storage bucket "expense-receipts"
  async function uploadReceipt(file, tenantId) {
    const ext = file.name.split('.').pop().toLowerCase()
    const fileName = `${tenantId}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`

    const { data, error } = await supabase.storage
      .from('expense-receipts')
      .upload(fileName, file, { cacheControl: '3600', upsert: false })

    if (error) throw error
    return data.path
  }

  async function addExpenseEntry(formData, receiptFile) {
    try {
      setError(null)

      let receipt_url = null
      if (receiptFile) {
        receipt_url = await uploadReceipt(receiptFile, profile.tenant_id)
      }

      const payload = {
        tenant_id: profile.tenant_id,
        project_id: formData.project_id,
        created_by: user.id,
        expense_date: formData.expense_date,
        category: formData.category,
        amount: parseFloat(formData.amount),
        description: formData.description,
        receipt_url,
      }

      const { data, error } = await supabase
        .from('expense_entries')
        .insert([payload])
        .select('*, projects(name, code), profiles!created_by(full_name)')
        .single()

      if (error) throw error

      setExpenses((prev) => [data, ...prev])
      return { success: true, data }
    } catch (err) {
      console.error('Error adding expense entry:', err.message)
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  // CEO: approve an expense entry
  async function approveExpense(id) {
    try {
      const { data, error } = await supabase
        .from('expense_entries')
        .update({
          status: 'approved',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          rejection_reason: null,
        })
        .eq('id', id)
        .select('*, projects(name, code), profiles!created_by(full_name)')
        .single()

      if (error) throw error

      setExpenses((prev) => prev.map((e) => (e.id === id ? data : e)))
      return { success: true, data }
    } catch (err) {
      console.error('Error approving expense:', err.message)
      return { success: false, error: err.message }
    }
  }

  // CEO: reject an expense entry (reason is mandatory)
  async function rejectExpense(id, reason) {
    try {
      if (!reason || !reason.trim()) {
        return { success: false, error: 'Alasan penolakan wajib diisi.' }
      }

      const { data, error } = await supabase
        .from('expense_entries')
        .update({
          status: 'rejected',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          rejection_reason: reason.trim(),
        })
        .eq('id', id)
        .select('*, projects(name, code), profiles!created_by(full_name)')
        .single()

      if (error) throw error

      setExpenses((prev) => prev.map((e) => (e.id === id ? data : e)))
      return { success: true, data }
    } catch (err) {
      console.error('Error rejecting expense:', err.message)
      return { success: false, error: err.message }
    }
  }

  // Generate a short-lived signed URL (1 hour) for a private receipt file
  async function getReceiptSignedUrl(path) {
    if (!path) return null
    const { data, error } = await supabase.storage
      .from('expense-receipts')
      .createSignedUrl(path, 3600)
    if (error) {
      console.error('Error creating signed URL:', error.message)
      return null
    }
    return data.signedUrl
  }

  return {
    expenses,
    loading,
    error,
    addExpenseEntry,
    approveExpense,
    rejectExpense,
    getReceiptSignedUrl,
    refetch: fetchExpenses,
  }
}
