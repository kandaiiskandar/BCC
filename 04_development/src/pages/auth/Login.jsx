import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../services/supabaseClient'
import { Eye, EyeOff, Lock } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    if (e) e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Fetch user profile role to navigate correctly
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      const role = profile?.role || 'project_manager'

      if (['ceo', 'director', 'super_admin'].includes(role)) {
        navigate('/dashboard')
      } else if (role === 'project_manager') {
        navigate('/sales-entry')
      } else if (role === 'admin') {
        navigate('/users')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      console.error(err)
      setErrorMsg('Alamat e-mel atau kata laluan salah. Sila cuba lagi.')
    } finally {
      setLoading(false)
    }
  }

  // Quick fill accounts helper for local testing
  const handleQuickFill = (testEmail) => {
    setEmail(testEmail)
    setPassword('Password123!')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-slate-200 p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-900 text-emerald-400 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-wide uppercase">Kop-Pusamaju</h1>
          <p className="text-sm font-medium text-slate-500">Business Command Centre</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alamat E-mel
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="pengurus@koperasi.my"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kata Laluan
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center text-slate-600">
              <input type="checkbox" className="rounded border-slate-300 text-blue-900 focus:ring-blue-900 mr-2" />
              Ingat saya
            </label>
            <a href="#" className="font-semibold text-blue-900 hover:underline">
              Lupa kata laluan?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'LOG MASUK'}
          </button>
        </form>

        {/* Development Quick Fills */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
            Akaun Ujian Pembangunan (Quick Fill)
          </p>
          <div className="grid grid-cols-2 gap-2 text-xxs">
            <button
              onClick={() => handleQuickFill('ceo@koperasi.my')}
              className="py-2 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded font-medium text-slate-700 transition-colors"
            >
              🔑 CEO Login
            </button>
            <button
              onClick={() => handleQuickFill('pm@koperasi.my')}
              className="py-2 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded font-medium text-slate-700 transition-colors"
            >
              🔑 PM Login
            </button>
            <button
              onClick={() => handleQuickFill('admin@koperasi.my')}
              className="py-2 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded font-medium text-slate-700 transition-colors"
            >
              🔑 Admin Login
            </button>
            <button
              onClick={() => handleQuickFill('director@koperasi.my')}
              className="py-2 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded font-medium text-slate-700 transition-colors"
            >
              🔑 Pengarah
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          © 2026 Kop-Pusamaju Berhad. Hak Cipta Terpelihara.
        </div>
      </div>
    </div>
  )
}
