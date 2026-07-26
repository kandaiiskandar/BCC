import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-medium text-slate-600">Memuatkan sesi pengguna...</p>
        </div>
      </div>
    )
  }

  // 1. If not authenticated, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // 2. If profile is missing or account deactivated, redirect to login
  if (!profile || !profile.is_active) {
    return <Navigate to="/login" replace />
  }

  // 3. If route specifies allowed roles, check access permission
  if (allowedRoles && allowedRoles.length > 0) {
    const hasPermission = allowedRoles.includes(profile.role)

    if (!hasPermission) {
      // Redirect to default home page based on user's role
      if (['ceo', 'director', 'super_admin'].includes(profile.role)) {
        return <Navigate to="/dashboard" replace />
      } else if (profile.role === 'project_manager') {
        return <Navigate to="/sales-entry" replace />
      } else if (profile.role === 'admin') {
        return <Navigate to="/users" replace />
      } else {
        return <Navigate to="/login" replace />
      }
    }
  }

  return children
}
