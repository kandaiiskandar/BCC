import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard,
  FileEdit,
  Receipt,
  Target,
  FileText,
  Users,
  Settings,
  LogOut,
  UserCheck
} from 'lucide-react'

export default function MainLayout({ children }) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  // Define menu items based on role
  const getMenuItems = () => {
    const role = profile?.role
    const items = []

    // CEO / Director / Super Admin Menu
    if (['ceo', 'director', 'super_admin'].includes(role)) {
      items.push(
        { path: '/dashboard', label: 'Papan Pemuka', icon: LayoutDashboard },
        { path: '/reports', label: 'Laporan Kewangan', icon: FileText }
      )
    }

    // PM Menu
    if (['project_manager', 'super_admin', 'ceo'].includes(role)) {
      items.push(
        { path: '/sales-entry', label: 'Rekod Jualan', icon: FileEdit },
        { path: '/expense-entry', label: 'Rekod Perbelanjaan', icon: Receipt }
      )
    }

    // CEO/Super Admin Exclusive Approvals & Targets
    if (['ceo', 'super_admin'].includes(role)) {
      items.push(
        { path: '/expense-approvals', label: 'Kelulusan Belanja', icon: UserCheck },
        { path: '/targets-config', label: 'Sasaran & KPI', icon: Target }
      )
    }

    // Admin Exclusive Menu
    if (['admin', 'super_admin'].includes(role)) {
      items.push(
        { path: '/users', label: 'Urus Pengguna', icon: Users },
        { path: '/settings', label: 'Tetapan Sistem', icon: Settings }
      )
    }

    return items
  }

  const menuItems = getMenuItems()

  // Format role label in BM
  const getRoleLabel = (role) => {
    switch (role) {
      case 'super_admin': return 'Super Admin'
      case 'ceo': return 'CEO'
      case 'director': return 'Pengarah'
      case 'project_manager': return 'Pengurus Projek'
      case 'admin': return 'Pentadbir'
      default: return 'Pengguna'
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between border-r border-slate-800 shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800">
            <h1 className="text-lg font-bold tracking-wider uppercase text-emerald-400">Kop-Pusamaju</h1>
            <p className="text-xxs text-slate-400 font-medium">Business Command Centre</p>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-900 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3 shrink-0" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Profile Summary */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{profile?.full_name}</p>
              <p className="text-xs text-slate-400 truncate">{profile?.email}</p>
              <span className="inline-block mt-1 text-[10px] font-semibold bg-emerald-900/40 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded">
                {getRoleLabel(profile?.role)}
              </span>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center py-2 px-4 bg-slate-800 hover:bg-red-950 hover:text-red-300 text-slate-300 text-xs font-semibold rounded-lg transition-colors border border-slate-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            LOG KELUAR
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-md font-semibold text-slate-800">
            {profile?.tenants?.name || 'Koperasi Pembangunan Usahasama Masyarakat Maju Sabah Berhad'}
          </h2>
          <div className="flex items-center text-xs font-medium text-slate-500">
            Sesi Penyewa: <span className="font-bold text-slate-800 ml-1">{profile?.tenants?.code}</span>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
