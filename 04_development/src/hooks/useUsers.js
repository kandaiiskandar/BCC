import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'

export function useUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user, profile } = useAuth()

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('profiles')
        .select('*, user_project_assignments(project_id, projects(id, name, code))')
        .order('full_name', { ascending: true })

      if (error) throw error
      setUsers(data || [])
    } catch (err) {
      console.error('Error fetching users:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user) fetchUsers()
  }, [user, fetchUsers])

  // Update an existing profile (role, full_name, is_active)
  async function updateUser(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select('*, user_project_assignments(project_id, projects(id, name, code))')
        .single()

      if (error) throw error

      setUsers((prev) => prev.map((u) => (u.id === userId ? data : u)))
      return { success: true, data }
    } catch (err) {
      console.error('Error updating user:', err.message)
      return { success: false, error: err.message }
    }
  }

  // Replace project assignments for a PM (delete all then re-insert)
  async function updateProjectAssignments(userId, projectIds) {
    try {
      // Delete existing assignments for this user
      const { error: deleteError } = await supabase
        .from('user_project_assignments')
        .delete()
        .eq('user_id', userId)

      if (deleteError) throw deleteError

      // Insert new assignments
      if (projectIds.length > 0) {
        const rows = projectIds.map((pid) => ({
          tenant_id: profile.tenant_id,
          user_id: userId,
          project_id: pid,
        }))

        const { error: insertError } = await supabase
          .from('user_project_assignments')
          .insert(rows)

        if (insertError) throw insertError
      }

      // Refetch to get updated assignments
      await fetchUsers()
      return { success: true }
    } catch (err) {
      console.error('Error updating project assignments:', err.message)
      return { success: false, error: err.message }
    }
  }

  // Invite a new user via Supabase Auth (sends magic link / invite email)
  async function inviteUser(email, fullName, role, projectIds) {
    try {
      // Use Supabase admin invite — creates auth.users entry and triggers handle_new_user
      const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
        data: {
          full_name: fullName,
          role,
          tenant_id: profile.tenant_id,
        },
      })

      if (error) throw error

      // Assign projects if PM
      if (role === 'project_manager' && projectIds.length > 0 && data?.user?.id) {
        await updateProjectAssignments(data.user.id, projectIds)
      } else {
        await fetchUsers()
      }

      return { success: true }
    } catch (err) {
      console.error('Error inviting user:', err.message)
      return { success: false, error: err.message }
    }
  }

  return {
    users,
    loading,
    error,
    updateUser,
    updateProjectAssignments,
    inviteUser,
    refetch: fetchUsers,
  }
}
