import React, { useState, useEffect } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import { supabase } from '../../services/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import { Settings as SettingsIcon, CheckCircle2, AlertCircle, Save, Bell, Calendar, BarChart2 } from 'lucide-react'

const SETTING_KEYS = {
  WARNING_THRESHOLD_PCT:   'warning_threshold_pct',
  CRITICAL_THRESHOLD_PCT:  'critical_threshold_pct',
  SUBMISSION_DEADLINE_DAY: 'submission_deadline_day',
  AUTO_REPORT_EMAILS:      'auto_report_emails',
}

export default function Settings() {
  const { profile } = useAuth()

  const [settings, setSettings] = useState({
    [SETTING_KEYS.WARNING_THRESHOLD_PCT]:   '80',
    [SETTING_KEYS.CRITICAL_THRESHOLD_PCT]:  '60',
    [SETTING_KEYS.SUBMISSION_DEADLINE_DAY]: '5',
    [SETTING_KEYS.AUTO_REPORT_EMAILS]:      '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('system_settings')
        .select('key, value')

      if (error) throw error

      if (data && data.length > 0) {
        const mapped = {}
        data.forEach((row) => { mapped[row.key] = row.value })
        setSettings((prev) => ({ ...prev, ...mapped }))
      }
    } catch (err) {
      console.error('Error fetching settings:', err.message)
    } finally {
      setLoading(false)
    }
  }

  async function saveSetting(key, value) {
    // Upsert: insert if not exists, update if exists
    const { error } = await supabase
      .from('system_settings')
      .upsert(
        { tenant_id: profile.tenant_id, key, value: String(value) },
        { onConflict: 'tenant_id,key' }
      )
    if (error) throw error
  }

  async function handleSaveAll() {
    setSuccessMsg('')
    setErrorMsg('')

    // Validate
    const warning = parseInt(settings[SETTING_KEYS.WARNING_THRESHOLD_PCT])
    const critical = parseInt(settings[SETTING_KEYS.CRITICAL_THRESHOLD_PCT])
    const deadline = parseInt(settings[SETTING_KEYS.SUBMISSION_DEADLINE_DAY])

    if (isNaN(warning) || warning < 1 || warning > 100) {
      setErrorMsg('Ambang Amaran mesti antara 1% hingga 100%.')
      return
    }
    if (isNaN(critical) || critical < 1 || critical >= warning) {
      setErrorMsg('Ambang Kritikal mesti lebih rendah daripada Ambang Amaran.')
      return
    }
    if (isNaN(deadline) || deadline < 1 || deadline > 28) {
      setErrorMsg('Tarikh akhir penyerahan mesti antara hari ke-1 hingga ke-28 setiap bulan.')
      return
    }

    setSaving(true)
    try {
      await Promise.all([
        saveSetting(SETTING_KEYS.WARNING_THRESHOLD_PCT,   settings[SETTING_KEYS.WARNING_THRESHOLD_PCT]),
        saveSetting(SETTING_KEYS.CRITICAL_THRESHOLD_PCT,  settings[SETTING_KEYS.CRITICAL_THRESHOLD_PCT]),
        saveSetting(SETTING_KEYS.SUBMISSION_DEADLINE_DAY, settings[SETTING_KEYS.SUBMISSION_DEADLINE_DAY]),
        saveSetting(SETTING_KEYS.AUTO_REPORT_EMAILS,      settings[SETTING_KEYS.AUTO_REPORT_EMAILS]),
      ])
      setSuccessMsg('Tetapan sistem berjaya disimpan.')
    } catch (err) {
      setErrorMsg(`Gagal menyimpan tetapan: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <MainLayout>
      <div className="p-8 max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tetapan Sistem</h1>
          <p className="text-sm text-slate-500 mt-1">
            Konfigurasi ambang KPI, tarikh akhir penyerahan data, dan penerima laporan automatik.
          </p>
        </div>

        {/* Banners */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-sm rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {errorMsg}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-500">Memuatkan tetapan sistem...</p>
          </div>
        ) : (
          <div className="space-y-6">

            {/* Section 1: KPI Thresholds */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <BarChart2 className="w-5 h-5 text-blue-900" />
                <h2 className="text-sm font-semibold text-slate-900">Ambang Prestasi KPI</h2>
              </div>
              <p className="text-xs text-slate-500">
                Tetapkan had peratusan pencapaian sasaran untuk menentukan status 🟡 Amaran dan 🔴 Kritikal pada papan pemuka.
              </p>

              <div className="grid grid-cols-2 gap-5">
                {/* Warning Threshold */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    🟡 Ambang Amaran (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={settings[SETTING_KEYS.WARNING_THRESHOLD_PCT]}
                      onChange={(e) => handleChange(SETTING_KEYS.WARNING_THRESHOLD_PCT, e.target.value)}
                      className="w-full px-3 py-2 pr-8 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">%</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Projek di bawah % ini akan ditanda 🟡. Lalai: 80%
                  </p>
                </div>

                {/* Critical Threshold */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    🔴 Ambang Kritikal (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={settings[SETTING_KEYS.CRITICAL_THRESHOLD_PCT]}
                      onChange={(e) => handleChange(SETTING_KEYS.CRITICAL_THRESHOLD_PCT, e.target.value)}
                      className="w-full px-3 py-2 pr-8 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">%</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Projek di bawah % ini akan ditanda 🔴. Lalai: 60%
                  </p>
                </div>
              </div>

              {/* Visual preview */}
              <div className="flex items-center gap-2 text-xs font-medium mt-1 p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500">Semasa:</span>
                <span className="text-emerald-700">🟢 ≥ {settings[SETTING_KEYS.WARNING_THRESHOLD_PCT]}%</span>
                <span className="text-slate-300">·</span>
                <span className="text-yellow-600">🟡 {settings[SETTING_KEYS.CRITICAL_THRESHOLD_PCT]}%–{parseInt(settings[SETTING_KEYS.WARNING_THRESHOLD_PCT]) - 1}%</span>
                <span className="text-slate-300">·</span>
                <span className="text-red-600">🔴 &lt; {settings[SETTING_KEYS.CRITICAL_THRESHOLD_PCT]}%</span>
              </div>
            </div>

            {/* Section 2: Submission Deadline */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Calendar className="w-5 h-5 text-blue-900" />
                <h2 className="text-sm font-semibold text-slate-900">Tarikh Akhir Penyerahan Data</h2>
              </div>
              <p className="text-xs text-slate-500">
                Sistem akan menghantar peringatan e-mel kepada Pengurus Projek yang belum menghantar data jualan/perbelanjaan menjelang tarikh ini setiap bulan.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-32">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hari Ke- (setiap bulan)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="28"
                      value={settings[SETTING_KEYS.SUBMISSION_DEADLINE_DAY]}
                      onChange={(e) => handleChange(SETTING_KEYS.SUBMISSION_DEADLINE_DAY, e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 focus:border-blue-900 text-center font-bold"
                    />
                  </div>
                </div>
                <p className="text-sm text-slate-600 mt-4">
                  haribulan setiap bulan
                </p>
              </div>
              <p className="text-[10px] text-slate-400">
                Contoh: Nilai 5 bermakna PM perlu hantar data sebelum 5hb setiap bulan. Lalai: 5hb.
              </p>
            </div>

            {/* Section 3: Auto Report Emails */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Bell className="w-5 h-5 text-blue-900" />
                <h2 className="text-sm font-semibold text-slate-900">Penerima Laporan Automatik</h2>
              </div>
              <p className="text-xs text-slate-500">
                Laporan bulanan akan dihantar secara automatik pada hari pertama setiap bulan kepada alamat e-mel berikut.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat E-mel Penerima
                  <span className="ml-1 text-slate-400 font-normal">(asingkan dengan koma jika lebih dari satu)</span>
                </label>
                <textarea
                  rows="3"
                  value={settings[SETTING_KEYS.AUTO_REPORT_EMAILS]}
                  onChange={(e) => handleChange(SETTING_KEYS.AUTO_REPORT_EMAILS, e.target.value)}
                  placeholder="ceo@koperasi.my, pengarah@koperasi.my, ketua@koperasi.my"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 focus:border-blue-900 resize-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Kosongkan untuk melumpuhkan penghantaran laporan automatik.
                </p>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Menyimpan...' : 'SIMPAN SEMUA TETAPAN'}
            </button>

            <p className="text-xs text-slate-400 text-center">
              Perubahan tetapan berkuat kuasa serta-merta. Rekod perubahan disimpan dalam audit trail sistem.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
