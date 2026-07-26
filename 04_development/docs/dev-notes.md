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

## 4. Next Implementation Tasks

The next developer or agent should proceed with:

### 4.1 Option C: Expense Entry & Approval Workflow
- Create **`pages/pm/ExpenseEntry.jsx`**: Form to submit expenses (categorized into 10 groups) and upload receipt attachments. Receipts are uploaded to a private bucket (`expense-receipts`) and retrieved using signed URLs.
- Create **`pages/ceo/ExpenseApprovals.jsx`**: Queue for the CEO to view pending expenses, download receipt files, and click `Lulus` (Approve) or `Tolak` (Reject - with a mandatory text reason).
- Create hooks: **`hooks/useExpenses.js`**.

### 4.2 Option D: CEO Executive Dashboard
- Create **`pages/ceo/Dashboard.jsx`**: The command centre landing page.
- Implement 4 KPI cards (Total Sales, Total Expenses, Net Profit/Loss, Target Achievement Counts).
- Include Recharts diagrams: Monthly sales/expenses bar chart, project revenue share donut chart.
- Implement targets progress summary table showing all 10 projects and 🟢/🟡/🔴 performance flags.

### 4.3 Option E: Admin Screens & Settings
- Create **`pages/admin/UserManagement.jsx`**: Manage profiles and map PMs to projects.
- Create **`pages/admin/Settings.jsx`**: Edit threshold values (warning threshold %, submission deadlines, auto-report emails).
