import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/layout/ProtectedRoute'
import MainLayout from './components/layout/MainLayout'
import Login from './pages/auth/Login'
import SalesEntry from './pages/pm/SalesEntry'

// Placeholder Views wrapped in MainLayout
const Dashboard = () => (
  <MainLayout>
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Papan Pemuka Eksekutif (CEO)</h1>
      <p className="text-slate-600">Selamat datang ke Business Command Centre Kop-Pusamaju.</p>
    </div>
  </MainLayout>
)

const ExpenseEntry = () => (
  <MainLayout>
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Rekod & Kelulusan Perbelanjaan</h1>
      <p className="text-slate-600">Urus perbelanjaan projek dan semakan kelulusan CEO.</p>
    </div>
  </MainLayout>
)

const UserManagement = () => (
  <MainLayout>
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Pengurusan Pengguna (Admin)</h1>
      <p className="text-slate-600">Urus profil pengguna, peranan, dan tugasan projek.</p>
    </div>
  </MainLayout>
)

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

          {/* Admin Routes */}
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <UserManagement />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}
