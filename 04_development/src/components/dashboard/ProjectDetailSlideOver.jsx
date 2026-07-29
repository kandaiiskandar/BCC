import React, { useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  X, TrendingUp, TrendingDown, Wallet, Calendar, Tag,
  ShoppingCart, FileText,
} from 'lucide-react'
import { formatRM, formatDateBM, getRevenueTypeLabel, getExpenseCategoryLabel } from '../../utils/formatters'

// Revenue type badge styles
const REVENUE_TYPE_STYLES = {
  regular:         'bg-blue-100 text-blue-800 border border-blue-200',
  recurring:       'bg-violet-100 text-violet-800 border border-violet-200',
  advance_deposit: 'bg-amber-100 text-amber-800 border border-amber-200',
}

function CustomBarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-2.5 text-xs">
      <p className="font-semibold text-slate-600 mb-0.5">{label}</p>
      <p className="text-blue-900 font-bold">{formatRM(payload[0]?.value)}</p>
    </div>
  )
}

export default function ProjectDetailSlideOver({ project, detail, loading, error, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!project) return null

  const totalSalesFromTrend = detail?.monthlyTrend?.reduce((s, m) => s + m.sales, 0) ?? 0
  const hasChartData = detail?.monthlyTrend?.some((m) => m.sales > 0)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg flex flex-col bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-200 bg-blue-900 text-white shrink-0">
          <div className="min-w-0 pr-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-300 mb-0.5">
              {project.code} · {project.industry}
            </p>
            <h2 className="text-lg font-bold leading-tight">{project.name}</h2>
          </div>
          <div className="flex items-center gap-3 shrink-0 mt-0.5">
            <span className="text-2xl leading-none">{project.statusFlag}</span>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-200 shrink-0">
          <KPIMini
            label="Hasil"
            value={formatRM(project.sales)}
            icon={TrendingUp}
            color="text-blue-900"
          />
          <KPIMini
            label="Belanja"
            value={formatRM(project.expenses)}
            icon={TrendingDown}
            color="text-red-500"
          />
          <KPIMini
            label="Untung Bersih"
            value={formatRM(project.profit)}
            icon={Wallet}
            color={project.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}
          />
        </div>

        {/* Target achievement bar */}
        {project.targetPct !== null && project.targetPct !== undefined && (
          <div className="px-6 py-3 border-b border-slate-100 bg-slate-50 shrink-0">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-500 font-medium">Pencapaian Sasaran Hasil</span>
              <span className={`font-bold ${project.targetPct >= 100 ? 'text-emerald-600' : project.targetPct >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                {project.targetPct.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${project.targetPct >= 100 ? 'bg-emerald-500' : project.targetPct >= 80 ? 'bg-yellow-400' : 'bg-red-400'}`}
                style={{ width: `${Math.min(project.targetPct, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs text-slate-400">Memuatkan data projek...</p>
            </div>
          )}

          {error && !loading && (
            <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              Gagal memuatkan data: {error}
            </div>
          )}

          {!loading && detail && (
            <div className="space-y-6 px-6 py-5">

              {/* Mini Bar Chart — 12-month trend */}
              <section>
                <SectionTitle icon={BarChart} label="Trend Hasil 12 Bulan Terkini" />
                {hasChartData ? (
                  <div className="mt-3">
                    <ResponsiveContainer width="100%" height={160}>
                      <BarChart data={detail.monthlyTrend} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis
                          dataKey="label"
                          tick={{ fontSize: 9, fill: '#94a3b8' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 9, fill: '#94a3b8' }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                          width={36}
                        />
                        <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#f1f5f9' }} />
                        <Bar dataKey="sales" name="Hasil" fill="#1e3a5f" radius={[3, 3, 0, 0]} maxBarSize={24} />
                      </BarChart>
                    </ResponsiveContainer>
                    <p className="text-[10px] text-slate-400 text-right mt-1">
                      Jumlah 12 bulan: {formatRM(totalSalesFromTrend)}
                    </p>
                  </div>
                ) : (
                  <EmptyState label="Tiada rekod jualan dalam 12 bulan terkini." />
                )}
              </section>

              {/* Recent Sales */}
              <section>
                <SectionTitle icon={ShoppingCart} label="Rekod Jualan Terkini (10 terakhir)" />
                {detail.recentSales.length === 0 ? (
                  <EmptyState label="Tiada rekod jualan untuk projek ini." />
                ) : (
                  <div className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden">
                    {detail.recentSales.map((s) => (
                      <div key={s.id} className="flex items-center justify-between px-4 py-3 bg-white hover:bg-slate-50/60 transition-colors">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${REVENUE_TYPE_STYLES[s.revenue_type] || 'bg-slate-100 text-slate-600'}`}>
                              {getRevenueTypeLabel(s.revenue_type)}
                            </span>
                            {s.client_name && (
                              <span className="text-[10px] text-slate-400 truncate max-w-[130px]">{s.client_name}</span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDateBM(s.sale_date)}
                          </p>
                        </div>
                        <p className="font-bold text-slate-800 text-sm shrink-0 ml-3">{formatRM(s.amount)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Recent Approved Expenses */}
              <section className="pb-4">
                <SectionTitle icon={FileText} label="Belanja Diluluskan Terkini (10 terakhir)" />
                {detail.recentExpenses.length === 0 ? (
                  <EmptyState label="Tiada belanja yang diluluskan untuk projek ini." />
                ) : (
                  <div className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden">
                    {detail.recentExpenses.map((e) => (
                      <div key={e.id} className="flex items-center justify-between px-4 py-3 bg-white hover:bg-slate-50/60 transition-colors">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <Tag className="w-3 h-3 text-slate-400 shrink-0" />
                            <p className="text-xs font-medium text-slate-700 truncate">
                              {getExpenseCategoryLabel(e.category)}
                            </p>
                          </div>
                          {e.description && (
                            <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[220px]">{e.description}</p>
                          )}
                          <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDateBM(e.expense_date)}
                          </p>
                        </div>
                        <p className="font-bold text-red-600 text-sm shrink-0 ml-3">{formatRM(e.amount)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-slate-200 bg-slate-50 text-xs text-slate-400 text-center">
          Tekan <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">Esc</kbd> atau klik di luar untuk tutup
        </div>
      </div>
    </>
  )
}

// ─── Small helper components ───────────────────────────────────────────────

function KPIMini({ label, value, icon: Icon, color }) {
  return (
    <div className="flex flex-col items-center justify-center py-3 px-2 gap-0.5">
      <Icon className={`w-4 h-4 ${color} mb-0.5`} />
      <p className="text-[10px] text-slate-400 font-medium">{label}</p>
      <p className={`text-sm font-bold ${color}`}>{value}</p>
    </div>
  )
}

function SectionTitle({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 rounded-md bg-blue-900 flex items-center justify-center shrink-0">
        <Icon className="w-3 h-3 text-white" />
      </div>
      <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">{label}</h3>
    </div>
  )
}

function EmptyState({ label }) {
  return (
    <p className="mt-3 text-xs text-slate-400 italic text-center py-6 bg-slate-50 rounded-xl border border-slate-100">
      {label}
    </p>
  )
}
