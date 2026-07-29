import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import { useDashboard } from '../../hooks/useDashboard'
import { useProjectDetail } from '../../hooks/useProjectDetail'
import { formatRM } from '../../utils/formatters'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, Tooltip as PieTooltip,
} from 'recharts'
import {
  TrendingUp, TrendingDown, Minus, Target, AlertTriangle,
  ArrowUpRight, CheckCircle2, BarChart2, PieChart as PieIcon,
} from 'lucide-react'
import ProjectDetailSlideOver from '../../components/dashboard/ProjectDetailSlideOver'

// Donut chart colours — navy/emerald/slate palette
const DONUT_COLORS = [
  '#1e3a5f', '#059669', '#0369a1', '#7c3aed',
  '#b45309', '#0891b2', '#be185d', '#4d7c0f',
  '#b91c1c', '#6b7280',
]

const DATE_FILTER_OPTIONS = [
  { value: 'current_month', label: 'Bulan Semasa' },
  { value: 'last_month', label: 'Bulan Lepas' },
  { value: 'quarter', label: '3 Bulan Terkini' },
  { value: 'ytd', label: 'Tahun Semasa (YTD)' },
]

function KPICard({ title, value, subtitle, change, icon: Icon, iconBg, positive = true }) {
  const hasChange = change !== null && change !== undefined
  const isPositive = change >= 0
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown
  const changeColor = (positive ? isPositive : !isPositive) ? 'text-emerald-600' : 'text-red-500'

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900 leading-tight">{value}</p>
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">{subtitle}</p>
        {hasChange && (
          <span className={`flex items-center text-xs font-semibold ${changeColor}`}>
            <ChangeIcon className="w-3.5 h-3.5 mr-0.5" />
            {Math.abs(change).toFixed(1)}%
          </span>
        )}
        {!hasChange && (
          <span className="flex items-center text-xs text-slate-400">
            <Minus className="w-3.5 h-3.5 mr-0.5" />
            Tiada data lepas
          </span>
        )}
      </div>
    </div>
  )
}

function CustomBarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      <p className="text-blue-900 font-bold">{formatRM(payload[0]?.value)}</p>
    </div>
  )
}

function CustomDonutTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const total = payload[0]?.payload?.total || 1
  const pct = ((payload[0].value / total) * 100).toFixed(1)
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-slate-700 mb-1">{payload[0].name}</p>
      <p className="font-bold text-slate-900">{formatRM(payload[0].value)}</p>
      <p className="text-slate-500">{pct}% daripada jumlah</p>
    </div>
  )
}

export default function Dashboard() {
  const { dashboardData, loading, dateFilter, setDateFilter } = useDashboard()
  const { detail, loading: detailLoading, error: detailError, fetchDetail, clearDetail } = useProjectDetail()
  const [search, setSearch] = useState('')
  const [selectedProject, setSelectedProject] = useState(null)
  const navigate = useNavigate()

  const handleProjectClick = (proj) => {
    setSelectedProject(proj)
    fetchDetail(proj.id)
  }

  const handleCloseSlideOver = () => {
    setSelectedProject(null)
    clearDetail()
  }

  const kpis = dashboardData?.kpis
  const projectStats = dashboardData?.projectStats || []
  const monthlyTrend = dashboardData?.monthlyTrend || []
  const projectBreakdown = dashboardData?.projectBreakdown || []
  const pendingCount = dashboardData?.pendingExpensesCount || 0

  // Add total to each breakdown entry for tooltip %
  const totalSalesBreakdown = projectBreakdown.reduce((a, b) => a + b.value, 0)
  const breakdownWithTotal = projectBreakdown.map((p) => ({ ...p, total: totalSalesBreakdown }))

  const filteredProjects = projectStats.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.industry.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <MainLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Papan Pemuka Eksekutif</h1>
            <p className="text-sm text-slate-500 mt-1">Ringkasan prestasi keseluruhan projek koperasi.</p>
          </div>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-medium bg-white focus:ring-2 focus:ring-blue-900 focus:border-blue-900 shadow-sm"
          >
            {DATE_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Pending Expenses Alert Banner */}
        {pendingCount > 0 && (
          <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />
              <p className="text-sm font-semibold text-yellow-800">
                ⚠️ {pendingCount} tuntutan perbelanjaan menunggu kelulusan anda.
              </p>
            </div>
            <button
              onClick={() => navigate('/expense-approvals')}
              className="text-xs font-bold text-yellow-800 border border-yellow-400 bg-yellow-100 hover:bg-yellow-200 px-3 py-1.5 rounded-lg transition-colors shrink-0"
            >
              Lihat & Luluskan Sekarang →
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-slate-500">Memuatkan data papan pemuka...</p>
          </div>
        ) : (
          <>
            {/* 4 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <KPICard
                title="Jumlah Hasil"
                value={formatRM(kpis?.totalSales)}
                subtitle="vs bulan / tempoh lepas"
                change={kpis?.salesChange}
                icon={TrendingUp}
                iconBg="bg-blue-900"
                positive={true}
              />
              <KPICard
                title="Jumlah Perbelanjaan"
                value={formatRM(kpis?.totalExpenses)}
                subtitle="Perbelanjaan diluluskan sahaja"
                change={kpis?.expensesChange}
                icon={TrendingDown}
                iconBg="bg-red-500"
                positive={false}
              />
              <KPICard
                title="Untung Bersih"
                value={formatRM(kpis?.netProfit)}
                subtitle={`Margin: ${kpis?.marginPct?.toFixed(1) ?? 0}%`}
                change={kpis?.profitChange}
                icon={ArrowUpRight}
                iconBg="bg-emerald-600"
                positive={true}
              />
              <KPICard
                title="Pencapaian Sasaran"
                value={`${kpis?.achievedCount ?? 0} / ${kpis?.projectsWithTargets ?? 0} Projek`}
                subtitle={`${kpis?.totalProjects ?? 0} projek aktif`}
                change={null}
                icon={Target}
                iconBg="bg-violet-600"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Bar Chart — Monthly Sales Trend */}
              <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center mb-5">
                  <BarChart2 className="w-5 h-5 text-blue-900 mr-2" />
                  <h2 className="text-sm font-semibold text-slate-900">Trend Hasil Bulanan (12 Bulan Terkini)</h2>
                </div>
                {monthlyTrend.every((m) => m.sales === 0) ? (
                  <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
                    Tiada data jualan untuk 12 bulan terkini.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={monthlyTrend} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `RM${(v / 1000).toFixed(0)}k`}
                        width={55}
                      />
                      <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#f1f5f9' }} />
                      <Bar dataKey="sales" name="Hasil" fill="#1e3a5f" radius={[4, 4, 0, 0]} maxBarSize={36} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Donut Chart — Revenue by Project */}
              <div className="xl:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center mb-5">
                  <PieIcon className="w-5 h-5 text-blue-900 mr-2" />
                  <h2 className="text-sm font-semibold text-slate-900">Pecahan Hasil Mengikut Projek</h2>
                </div>
                {breakdownWithTotal.length === 0 ? (
                  <div className="flex items-center justify-center h-48 text-slate-400 text-sm text-center">
                    Tiada data jualan untuk tempoh ini.
                  </div>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie
                          data={breakdownWithTotal}
                          cx="50%"
                          cy="50%"
                          innerRadius={48}
                          outerRadius={72}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {breakdownWithTotal.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                          ))}
                        </Pie>
                        <PieTooltip content={<CustomDonutTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-3 space-y-1.5 max-h-32 overflow-y-auto pr-1">
                      {breakdownWithTotal.map((p, i) => {
                        const pct = totalSalesBreakdown > 0 ? ((p.value / totalSalesBreakdown) * 100).toFixed(1) : 0
                        return (
                          <div key={p.name} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span
                                className="w-2.5 h-2.5 rounded-sm shrink-0"
                                style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }}
                              />
                              <span className="text-slate-700 truncate">{p.name}</span>
                            </div>
                            <span className="font-semibold text-slate-600 ml-2 shrink-0">{pct}%</span>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Project Summary Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
                <div className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-blue-900 mr-2" />
                  <h2 className="text-sm font-semibold text-slate-900">Ringkasan Prestasi Projek</h2>
                </div>
                <input
                  type="text"
                  placeholder="Cari projek atau industri..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-900 focus:border-blue-900 w-52"
                />
              </div>

              {filteredProjects.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  Tiada projek yang sepadan dengan carian.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">
                        <th className="py-3 px-5">Projek</th>
                        <th className="py-3 px-5">Industri</th>
                        <th className="py-3 px-5 text-right">Hasil (RM)</th>
                        <th className="py-3 px-5 text-right">Belanja (RM)</th>
                        <th className="py-3 px-5 text-right">Untung (RM)</th>
                        <th className="py-3 px-5 text-right">% Sasaran</th>
                        <th className="py-3 px-5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredProjects.map((proj, idx) => (
                        <tr
                          key={proj.id}
                          className="group hover:bg-blue-50/40 cursor-pointer transition-colors"
                          onClick={() => handleProjectClick(proj)}
                        >
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400">{idx + 1}.</span>
                              <span className="font-semibold text-slate-900">{proj.name}</span>
                              {/* Hover tooltip */}
                              <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 text-[10px] font-semibold text-blue-900 bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                                Lihat perincian →
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-5 text-xs text-slate-500">{proj.industry}</td>
                          <td className="py-3.5 px-5 text-right font-semibold text-slate-800">
                            {formatRM(proj.sales)}
                          </td>
                          <td className="py-3.5 px-5 text-right text-slate-600">
                            {formatRM(proj.expenses)}
                          </td>
                          <td className={`py-3.5 px-5 text-right font-bold ${proj.profit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                            {formatRM(proj.profit)}
                          </td>
                          <td className="py-3.5 px-5 text-right">
                            {proj.targetPct !== null ? (
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-16 bg-slate-200 rounded-full h-1.5">
                                  <div
                                    className={`h-1.5 rounded-full ${proj.targetPct >= 100 ? 'bg-emerald-500' : proj.targetPct >= 80 ? 'bg-yellow-400' : 'bg-red-400'}`}
                                    style={{ width: `${Math.min(proj.targetPct, 100)}%` }}
                                  />
                                </div>
                                <span className="text-xs font-semibold text-slate-700 w-12 text-right">
                                  {proj.targetPct.toFixed(1)}%
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400">Tiada sasaran</span>
                            )}
                          </td>
                          <td className="py-3.5 px-5 text-center text-lg">{proj.statusFlag}</td>
                        </tr>
                      ))}
                    </tbody>
                    {/* Footer totals */}
                    <tfoot>
                      <tr className="bg-slate-50 border-t-2 border-slate-200 text-sm font-bold">
                        <td colSpan={2} className="py-3 px-5 text-slate-700">JUMLAH KESELURUHAN</td>
                        <td className="py-3 px-5 text-right text-blue-900">
                          {formatRM(filteredProjects.reduce((a, p) => a + p.sales, 0))}
                        </td>
                        <td className="py-3 px-5 text-right text-red-600">
                          {formatRM(filteredProjects.reduce((a, p) => a + p.expenses, 0))}
                        </td>
                        <td className="py-3 px-5 text-right text-emerald-700">
                          {formatRM(filteredProjects.reduce((a, p) => a + p.profit, 0))}
                        </td>
                        <td colSpan={2} />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              <div className="px-6 py-3 border-t border-slate-100 bg-slate-50">
                <p className="text-xs text-slate-400">
                  🟢 Mencapai sasaran (≥100%) &nbsp;·&nbsp; 🟡 Hampir sasaran (80%–99%) &nbsp;·&nbsp; 🔴 Di bawah sasaran (&lt;80%) &nbsp;·&nbsp; ⚪ Tiada sasaran ditetapkan
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Project Detail Slide-Over */}
      {selectedProject && (
        <ProjectDetailSlideOver
          project={selectedProject}
          detail={detail}
          loading={detailLoading}
          error={detailError}
          onClose={handleCloseSlideOver}
        />
      )}
    </MainLayout>
  )
}
