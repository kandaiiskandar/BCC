import React, { useState } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import { useUsers } from '../../hooks/useUsers'
import { useProjects } from '../../hooks/useProjects'
import { Users, UserPlus, Edit2, CheckCircle2, AlertCircle, X, Shield } from 'lucide-react'

const ROLES = [
  { value: 'ceo',              label: 'CEO' },
  { value: 'director',         label: 'Pengarah (Director)' },
  { value: 'project_manager',  label: 'Pengurus Projek (PM)' },
  { value: 'admin',            label: 'Pentadbir (Admin)' },
  { value: 'super_admin',      label: 'Super Admin' },
]

function getRoleLabel(role) {
  return ROLES.find((r) => r.value === role)?.label || role
}

function getRoleBadgeClass(role) {
  switch (role) {
    case 'super_admin':      return 'bg-violet-100 text-violet-800 border-violet-200'
    case 'ceo':              return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'director':         return 'bg-cyan-100 text-cyan-700 border-cyan-200'
    case 'project_manager':  return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    case 'admin':            return 'bg-slate-100 text-slate-700 border-slate-200'
    default:                 return 'bg-slate-100 text-slate-600 border-slate-200'
  }
}

const EMPTY_FORM = {
  full_name: '',
  email: '',
  role: 'project_manager',
  is_active: true,
  projectIds: [],
}

export default function UserManagement() {
  const { users, loading, updateUser, updateProjectAssignments, inviteUser } = useUsers()
  const { projects } = useProjects()

  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null) // null = new user
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [search, setSearch] = useState('')

  const openAddModal = () => {
    setEditingUser(null)
    setFormData(EMPTY_FORM)
    setSuccessMsg('')
    setErrorMsg('')
    setShowModal(true)
  }

  const openEditModal = (u) => {
    setEditingUser(u)
    setFormData({
      full_name: u.full_name,
      email: u.email,
      role: u.role,
      is_active: u.is_active,
      projectIds: (u.user_project_assignments || []).map((a) => a.project_id),
    })
    setSuccessMsg('')
    setErrorMsg('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingUser(null)
    setFormData(EMPTY_FORM)
    setSuccessMsg('')
    setErrorMsg('')
  }

  const toggleProject = (projectId) => {
    setFormData((prev) => ({
      ...prev,
      projectIds: prev.projectIds.includes(projectId)
        ? prev.projectIds.filter((id) => id !== projectId)
        : [...prev.projectIds, projectId],
    }))
  }

  const handleSave = async () => {
    setSuccessMsg('')
    setErrorMsg('')

    if (!formData.full_name.trim()) {
      setErrorMsg('Sila masukkan nama penuh.')
      return
    }
    if (!formData.email.trim()) {
      setErrorMsg('Sila masukkan alamat e-mel.')
      return
    }

    setSaving(true)

    if (editingUser) {
      // Update existing user profile
      const result = await updateUser(editingUser.id, {
        full_name: formData.full_name.trim(),
        role: formData.role,
        is_active: formData.is_active,
      })

      if (!result.success) {
        setErrorMsg(`Gagal mengemaskini profil: ${result.error}`)
        setSaving(false)
        return
      }

      // Update project assignments if PM
      if (formData.role === 'project_manager') {
        const assignResult = await updateProjectAssignments(editingUser.id, formData.projectIds)
        if (!assignResult.success) {
          setErrorMsg(`Profil disimpan tetapi gagal kemaskini tugasan projek: ${assignResult.error}`)
          setSaving(false)
          return
        }
      }

      setSuccessMsg('Profil pengguna berjaya dikemaskini.')
    } else {
      // Invite new user
      const result = await inviteUser(
        formData.email.trim(),
        formData.full_name.trim(),
        formData.role,
        formData.projectIds,
      )

      if (!result.success) {
        setErrorMsg(`Gagal menjemput pengguna: ${result.error}`)
        setSaving(false)
        return
      }

      setSuccessMsg('Jemputan e-mel berjaya dihantar kepada pengguna baharu.')
    }

    setSaving(false)
    setTimeout(closeModal, 1500)
  }

  const filteredUsers = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      getRoleLabel(u.role).toLowerCase().includes(search.toLowerCase()),
  )

  const activeCount = users.filter((u) => u.is_active).length
  const inactiveCount = users.filter((u) => !u.is_active).length

  return (
    <MainLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Pengurusan Pengguna</h1>
            <p className="text-sm text-slate-500 mt-1">
              Urus keahlian pengguna, peranan capaian, dan tugasan projek.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            + TAMBAH PENGGUNA
          </button>
        </div>

        {/* Summary chips */}
        <div className="flex gap-3 flex-wrap">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Jumlah: {users.length} pengguna
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            🟢 Aktif: {activeCount}
          </span>
          {inactiveCount > 0 && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
              ⚫ Nyahaktif: {inactiveCount}
            </span>
          )}
        </div>

        {/* User Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-900" />
              <h2 className="text-sm font-semibold text-slate-900">Senarai Pengguna Sistem</h2>
            </div>
            <input
              type="text"
              placeholder="Cari nama, e-mel atau peranan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-900 focus:border-blue-900 w-56"
            />
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs text-slate-500">Memuatkan senarai pengguna...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm">
              Tiada pengguna yang sepadan dengan carian.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">
                    <th className="py-3 px-5">Nama Penuh</th>
                    <th className="py-3 px-5">Alamat E-mel</th>
                    <th className="py-3 px-5">Peranan</th>
                    <th className="py-3 px-5">Projek Ditugaskan</th>
                    <th className="py-3 px-5 text-center">Status</th>
                    <th className="py-3 px-5 text-center">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredUsers.map((u) => {
                    const assignments = u.user_project_assignments || []
                    const isAllProjects = ['ceo', 'director', 'super_admin'].includes(u.role)
                    const isAdminOnly = u.role === 'admin'

                    return (
                      <tr key={u.id} className={`hover:bg-slate-50/80 transition-colors ${!u.is_active ? 'opacity-50' : ''}`}>
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                              {u.full_name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-slate-900">{u.full_name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 text-slate-600 text-xs">{u.email}</td>
                        <td className="py-3.5 px-5">
                          <span className={`inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full border ${getRoleBadgeClass(u.role)}`}>
                            {getRoleLabel(u.role)}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-xs text-slate-600 max-w-xs">
                          {isAllProjects ? (
                            <span className="text-slate-500 italic">Semua Projek</span>
                          ) : isAdminOnly ? (
                            <span className="text-slate-400 italic">Tiada (Urus Pengguna)</span>
                          ) : assignments.length === 0 ? (
                            <span className="text-amber-600 font-medium">⚠️ Belum ditugaskan</span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {assignments.map((a) => (
                                <span key={a.project_id} className="bg-blue-50 text-blue-800 border border-blue-200 px-1.5 py-0.5 rounded text-[10px] font-medium">
                                  {a.projects?.code}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          <span className={`inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full border ${u.is_active ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                            {u.is_active ? '🟢 Aktif' : '⚫ Nyahaktif'}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          <button
                            onClick={() => openEditModal(u)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-blue-900 hover:underline px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors border border-blue-200 mx-auto"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            Edit
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-900" />
                <h3 className="text-base font-bold text-slate-900">
                  {editingUser ? 'Kemaskini Profil Pengguna' : 'Tambah Pengguna Baharu'}
                </h3>
              </div>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-auto p-6 space-y-4">
              {/* Success / Error */}
              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errorMsg}
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Penuh <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData((p) => ({ ...p, full_name: e.target.value }))}
                  placeholder="Contoh: Siti Sarah Binti Abdullah"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat E-mel <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  placeholder="sarah@koperasi.my"
                  disabled={!!editingUser}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 focus:border-blue-900 disabled:bg-slate-50 disabled:text-slate-400"
                />
                {editingUser && (
                  <p className="text-[10px] text-slate-400 mt-1">E-mel tidak boleh diubah selepas akaun dicipta.</p>
                )}
              </div>

              {/* Role & Status Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Peranan Sistem <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value, projectIds: [] }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 focus:border-blue-900 bg-white"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Status Akaun
                  </label>
                  <div className="flex gap-4 pt-1">
                    {[{ value: true, label: 'Aktif' }, { value: false, label: 'Nyahaktif' }].map((opt) => (
                      <label key={String(opt.value)} className="flex items-center gap-1.5 cursor-pointer text-sm text-slate-700">
                        <input
                          type="radio"
                          name="is_active"
                          checked={formData.is_active === opt.value}
                          onChange={() => setFormData((p) => ({ ...p, is_active: opt.value }))}
                          className="accent-blue-900"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Project Assignments — only for PM */}
              {formData.role === 'project_manager' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Tugasan Projek
                    <span className="ml-1 text-slate-400 font-normal">(pilih satu atau lebih)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    {projects.map((proj) => (
                      <label key={proj.id} className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 hover:text-blue-900">
                        <input
                          type="checkbox"
                          checked={formData.projectIds.includes(proj.id)}
                          onChange={() => toggleProject(proj.id)}
                          className="accent-blue-900 w-4 h-4 shrink-0"
                        />
                        <span className="truncate">
                          <span className="text-[10px] text-slate-400 mr-1 font-mono">{proj.code}</span>
                          {proj.name}
                        </span>
                      </label>
                    ))}
                  </div>
                  {formData.projectIds.length === 0 && (
                    <p className="text-[10px] text-amber-600 mt-1">⚠️ Pengurus Projek yang tiada tugasan tidak akan nampak sebarang data.</p>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex gap-3 shrink-0">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : editingUser ? 'SIMPAN PROFIL' : 'HANTAR JEMPUTAN'}
              </button>
              <button
                onClick={closeModal}
                className="px-5 py-2.5 text-slate-600 hover:bg-slate-200 rounded-xl text-sm font-medium transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  )
}
