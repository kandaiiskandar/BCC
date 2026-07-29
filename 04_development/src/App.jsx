import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Login from './pages/auth/Login'
import SalesEntry from './pages/pm/SalesEntry'
import ExpenseEntry from './pages/pm/ExpenseEntry'
import ExpenseApprovals from './pages/ceo/ExpenseApprovals'
import Dashboard from './pages/ceo/Dashboard'
import Reports from './pages/ceo/Reports'
import TargetsConfig from './pages/ceo/TargetsConfig'
import UserManagement from './pages/admin/UserManagement'
import Settings from './pages/admin/Settings'

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* CEO / Director / Super Admin Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ceo', 'director', 'super_admin']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={['ceo', 'director', 'super_admin']}>
                <Reports />
              </ProtectedRoute>
            }
          />

          {/* Project Manager / CEO Routes */}
          <Route
            path="/sales-entry"
            element={
              <ProtectedRoute allowedRoles={['project_manager', 'ceo', 'super_admin']}>
                <SalesEntry />
              </ProtectedRoute>
            }
          />

          <Route
            path="/expense-entry"
            element={
              <ProtectedRoute allowedRoles={['project_manager', 'ceo', 'super_admin']}>
                <ExpenseEntry />
              </ProtectedRoute>
            }
          />

          <Route
            path="/targets-config"
            element={
              <ProtectedRoute allowedRoles={['ceo', 'super_admin']}>
                <TargetsConfig />
              </ProtectedRoute>
            }
          />

          {/* CEO Expense Approval Route */}
          <Route
            path="/expense-approvals"
            element={
              <ProtectedRoute allowedRoles={['ceo', 'super_admin']}>
                <ExpenseApprovals />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}
