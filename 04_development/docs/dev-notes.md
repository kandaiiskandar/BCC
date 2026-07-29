# Developer Progress & Handover Notes

This document describes the current development status of the **Business Command Centre (Kop-Pusamaju)**. It guides the handover to subsequent developers or agents to continue Fasa 1 MVP implementation.

---

## 1. What Has Been Built

### 1.1 Backend Configuration (`supabase/`)
Local Supabase backend is configured and live:
- **`supabase/migrations/20260726000000_init_schema.sql`**: Initial migration containing custom ENUMs, 11 core tables, performance indexes, RLS policies, and triggers (`set_updated_at`, `handle_new_user` on auth signups, and `audit_trail_trigger_func`).
- **`supabase/seed.sql`**: Sets up `KOP-PUSAMAJU` tenant, default warning parameters, 10 active projects, and 4 test user accounts in `auth.users` with correct bcrypt password hashes.
- **Configured Environment (`.env.local`)**: Links the Vite frontend to the local Supabase containers (`http://127.0.0.1:54321`).

### 1.2 Frontend Architecture (`src/`)
React SPA (React 18, Vite 5, Tailwind CSS 3) is scaffolded:
- **Global Session State (`context/AuthContext.jsx`)**: Automatically hydrates and listens for auth changes. Fetches the active user profile and tenant specifications (`role`, `is_active`, `tenant_id`).
- **Role-Based Guards (`components/layout/ProtectedRoute.jsx`)**: Checks authentication status and redirects unauthorized users back to their respective landing pages.
- **Sidebar & Header (`components/layout/MainLayout.jsx`)**: A navigation panel styled with Kop-Pusamaju colors (Navy/Emerald) displaying BM options dynamically filtered based on the logged-in user's role.
- **BM Formatters (`utils/formatters.js`)**: Helper utilities for currency formatting (`RM 0.00`), date conversions (`26 Julai 2026`), and category translations.
- **Supabase Client (`services/supabaseClient.js`)**: Instantiates the Supabase connection wrapper.

### 1.3 Implemented Screens (`src/pages/`)
- **`pages/auth/Login.jsx` (Login Screen)**: Features validation inputs in BM, a show/hide password toggle, and Quick Fill buttons for fast testing (CEO, PM, Admin, Director).
- **`pages/pm/SalesEntry.jsx` (Sales Entry Screen)**: PM entry form linking to `useProjects.js` and `useSales.js` hooks. Allows selecting assigned projects (filtered by RLS), inserting monthly sales by revenue types (Biasa, Berulang, Deposit), and deleting submitted records.
- **`pages/pm/ExpenseEntry.jsx` (Expense Entry Screen)**: PM expense submission form with 10 categories, drag-and-drop receipt upload to Supabase Storage (`expense-receipts` bucket, signed URLs), and a submission log with live status badges (⏳/🟢/🔴). Rejection reasons shown inline.
- **`pages/ceo/ExpenseApprovals.jsx` (CEO Expense Approval Screen)**: Full approval queue for CEO. Click "Semak" opens a modal with expense details, receipt preview (image inline, PDF via signed link), and approve/reject actions. Rejection requires a mandatory written reason. Status is immutable after a decision.

---

## 2. Pre-Configured Test Accounts

All test accounts use the default password: **`Password123!`**

| Role | Email | Name | Assigned Projects | Default Route |
|---|---|---|---|---|
| **CEO** | `ceo@koperasi.my` | Ahmad Fauzi (CEO) | All Projects (Read + Approvals) | `/dashboard` |
| **PM** | `pm@koperasi.my` | Siti Sarah | Ar-rahnu & Freshmart (Read/Write) | `/sales-entry` |
| **Director** | `director@koperasi.my` | Rohani Ali | All Projects (View Only) | `/dashboard` |
| **Admin** | `admin@koperasi.my` | Khairul | None (User Management & Settings) | `/users` |

For detailed metadata, see `04_development/docs/test-accounts.md`.

---

## 3. Quick Start Development

To run the project locally:

```bash
# 1. Start the database (inside 04_development/)
supabase start

# 2. Open another terminal and start the React dev server
pnpm dev
```
*Note: If the database is out of sync, run `supabase db reset` to apply clean migrations and seed users.*

---

## 4. Completed Modules (Summary)

All Fasa 1 screens are implemented. See sections below for details.

---

### ✅ Option C: Expense Entry & Approval Workflow — SELESAI
- `pages/pm/ExpenseEntry.jsx` ✅
- `pages/ceo/ExpenseApprovals.jsx` ✅
- `hooks/useExpenses.js` ✅
- `utils/formatters.js` — tambah `getExpenseCategoryLabel` + `getExpenseStatusBadge` ✅
- `App.jsx` — import real components, tambah `/expense-approvals` route ✅

### ✅ Option D: CEO Executive Dashboard — SELESAI
- `hooks/useDashboard.js` ✅ — parallel Supabase queries; calculates KPIs, per-project stats, 12-month trend, donut breakdown; supports 4 date filters (current month, last month, quarter, YTD)
- `pages/ceo/Dashboard.jsx` ✅ — 4 KPI cards with % change vs previous period, bar chart (12-month trend via Recharts), donut chart (revenue by project), project table with progress bars + 🟢🟡🔴 flags + search + totals footer, pending expense alert banner
- `App.jsx` — import real Dashboard component ✅

### ✅ Option E: Admin Screens & Settings — SELESAI
- `hooks/useUsers.js` ✅ — fetch all profiles with project assignments, updateUser, updateProjectAssignments, inviteUser (Supabase auth.admin.inviteUserByEmail)
- `pages/admin/UserManagement.jsx` ✅ — user list table with role badges, search, add/edit modal with project checkbox assignments (PM only), activate/deactivate toggle
- `pages/admin/Settings.jsx` ✅ — 3 setting groups: KPI thresholds (warning % + critical % with live preview), submission deadline day, auto-report email recipients; upsert to `system_settings` table
- `App.jsx` — import real components, tambah `/settings` route ✅

---

### ✅ Sasaran & KPI — SELESAI
- `hooks/useTargets.js` ✅ — fetch projects + targets for selected year/month; batch upsert using unique constraint `(tenant_id, project_id, year, month)`
- `pages/ceo/TargetsConfig.jsx` ✅ — year/month filter, editable table (target_revenue + target_profit_margin per project), inline saved values shown below inputs, "Kemaskini Semua" saves all at once
- `App.jsx` — tambah `/targets-config` route ✅

### ✅ Laporan Kewangan — Excel Export SELESAI
- `hooks/useReports.js` ✅ — parallel queries (sales, approved expenses, projects, targets); aggregates per project; supports 3 filters (month, quarter, YTD)
- `pages/ceo/Reports.jsx` ✅ — filter panel, preview table with KPI header (navy), project summary table, data counts, Excel export via SheetJS (3 sheets: Ringkasan Projek, Data Jualan, Belanja Diluluskan)
- **Nota:** Iskandar perlu jalankan `pnpm add xlsx` sebelum test

---

## 5. Pending Manual Setup (Buat Kemudian)

| # | Perkara | Bila |
|---|---|---|
| 1 | Buat Supabase Storage bucket `expense-receipts` (Private) — Dashboard → Storage → New Bucket | Sebelum demo |
| 2 | `pnpm add recharts` — diperlukan untuk Papan Pemuka (bar chart + donut chart) | Sebelum test Dashboard |
| 3 | `pnpm add xlsx` — diperlukan untuk eksport Excel dalam Laporan Kewangan | Sebelum test Reports |
