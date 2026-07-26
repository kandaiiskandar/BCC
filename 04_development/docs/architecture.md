# Business Command Centre — System Architecture Specification

**Document:** System Architecture Specification  
**System:** Business Command Centre (Koperasi Pembangunan Usahasama Masyarakat Maju Sabah Berhad — Kop-Pusamaju)  
**Author:** Lead Systems Architect & Senior Engineer (Iskandar)  
**Date:** July 26, 2026  
**Version:** 1.0  
**Status:** Approved & Ready for Implementation  

---

## 1. Overview & Architectural Principles

The **Business Command Centre (BCC)** is a centralized management command system designed to give executive decision-makers (CEO, Directors) real-time operational and financial visibility across all business units (projects), while empowering Project Managers to record monthly sales performance and expense entries.

While Phase 1 is tailored specifically for **Kop-Pusamaju** (~10 active projects across diverse industries), the architecture is engineered from day one to be **SaaS Commercialization & Multi-Tenancy Ready**.

### Core Guiding Architectural Principles

1. **Config-Driven & Multi-Tenant Ready:**
   Every database table and service incorporates a `tenant_id` context. System configuration, settings, brand assets, and API bindings are entirely driven by environment variables and tenant configuration tables, ensuring seamless isolation without code changes.
2. **Project-Agnostic Engine:**
   No business project names or industrial logic are hardcoded. New projects, targets, and operational metrics can be provisioned dynamically via administrative interfaces.
3. **Database-Enforced Security (Zero Trust RLS):**
   Security does not rely solely on frontend application code. All data access, mutation privileges, and role permissions are strictly validated at the PostgreSQL layer using Supabase Row Level Security (RLS).
4. **Lightweight & Modular Frontend:**
   The client application leverages React 18+ SPA architecture powered by Vite, utilizing standard React Context and custom hooks for state management to avoid heavy, unnecessary state library overhead while keeping module boundaries clean and maintainable.
5. **Seamless Infrastructure Portability:**
   The entire system can be seamlessly migrated between Local Docker environments (`supabase start`), Supabase Cloud, and Self-Hosted VPS deployments (Supabase Docker Stack) using identical codebases and environment variable bindings.

---

## 2. System Topology

The Business Command Centre follows a modern Single-Page Application (SPA) and Backend-as-a-Service (BaaS) topology. The React frontend interacts with Supabase services via standard HTTPS/REST, WebSockets (Realtime), and RPC interfaces.

### 2.1 High-Level Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                CLIENT LAYER                                       |
|                                                                                   |
|      +---------------------------------------------------------------------+      |
|      |                  React 18+ Single Page Application                    |      |
|      |                        (Vite + Tailwind CSS)                        |      |
|      +---------------------------------------------------------------------+      |
|         |                     |                      |                     |      |
|         | Auth SDK            | PostgREST Client     | Storage SDK         | RPC  |
+---------|---------------------|----------------------|---------------------|------+
          |                     |                      |                     |
          v                     v                      v                     v
+-----------------------------------------------------------------------------------+
|                              SUPABASE BACKEND LAYER                               |
|                                                                                   |
|   +---------------+   +------------------+   +----------------+   +-----------+   |
|   | Supabase Auth |   |  PostgREST API   |   | Supabase       |   | Database  |   |
|   |   (GoTrue)    |   | (Auto REST CRUD) |   | File Storage   |   |   RPCs    |   |
|   +---------------+   +------------------+   +----------------+   +-----------+   |
|           |                    |                     |                  |         |
|           +--------------------+----------+----------+------------------+         |
|                                           |                                       |
|                                           v                                       |
|   +---------------------------------------------------------------------------+   |
|   |                          PostgreSQL 15+ Engine                            |   |
|   |                                                                           |   |
|   |  - Custom ENUMs & Domain Schemas   - Row Level Security (RLS) Policies     |   |
|   |  - Performance Indexes (B-Tree)    - Automated Audit Trail Triggers       |   |
|   +---------------------------------------------------------------------------+   |
|                                           ^                                       |
|                                           | pg_net / Database Webhooks            |
|                                           v                                       |
|   +---------------------------------------------------------------------------+   |
|   |                     Supabase Edge Functions Runtime                       |   |
|   |                            (Deno Serverless)                              |   |
|   |                                                                           |   |
|   |  - expense-approval-notifier  - monthly-report-scheduler                  |   |
|   |  - deadline-warning-reminder  - SMTP Email Gateway                        |   |
|   +---------------------------------------------------------------------------+   |
|                                           ^                                       |
|                                           | Scheduled Triggers                    |
|                                           | (pg_cron / Supabase Cloud Cron)       |
|                                           +                                       |
+-----------------------------------------------------------------------------------+
```

### 2.2 System Component Description

| Component Layer | Technology | Primary Function & Responsibilities |
|---|---|---|
| **Client Layer** | React 18+, Vite, Tailwind CSS, Recharts | Interactive UI for exec dashboards, sales/expense data entry, reporting, target settings, user administration. |
| **Authentication** | Supabase Auth (GoTrue) | Manages user sign-in, JWT session tokens, password resets, and session hydration. |
| **REST API Engine** | PostgREST | Auto-generates type-safe OpenAPI/RESTful endpoints for database tables with filter/sort/pagination capabilities. |
| **Storage Engine** | Supabase Storage | Hosts private file attachments (expense receipts/invoices) inside the secure `'expense-receipts'` bucket. |
| **Database Engine** | PostgreSQL 15+ | Core transactional datastore enforcing RLS, foreign keys, custom ENUMs, and automated audit logging triggers. |
| **RPC Stored Procedures** | PL/pgSQL Functions | Executes complex multi-step backend operations (e.g., `calculate_shared_expense_allocations`, `get_dashboard_summary`). |
| **Edge Functions** | Deno Serverless Runtime | Background asynchronous tasks: sending approval emails, generating monthly PDF/Excel reports, sending deadline warnings via SMTP. |
| **Job Scheduler** | `pg_cron` / Supabase Cron | Triggers monthly automated report generation and deadline reminder functions on configured calendar schedules. |

---

## 3. React Frontend Architecture

The client application is built on **React 18+** bundled with **Vite** for fast development and optimal production bundling.

### 3.1 Project Directory Structure (`04_development/src/`)

```
04_development/src/
├── assets/                  # Static media, icons, and brand logos
│   ├── logo-koperasi.svg
│   └── icons/
├── components/              # Modular, reusable UI components
│   ├── common/              # Generic UI widgets
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   ├── Table.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── StatusBadge.jsx
│   ├── dashboard/           # CEO & Executive Dashboard components
│   │   ├── KpiCards.jsx
│   │   ├── RevenueBarChart.jsx
│   │   ├── SharePieChart.jsx
│   │   ├── TrendLineChart.jsx
│   │   └── ProjectSummaryTable.jsx
│   ├── entries/             # Data entry components
│   │   ├── SalesEntryForm.jsx
│   │   ├── ExpenseEntryForm.jsx
│   │   └── ReceiptUploader.jsx
│   ├── approvals/           # Expense review and approval components
│   │   ├── ExpenseApprovalTable.jsx
│   │   └── RejectionModal.jsx
│   ├── targets/             # KPI & Target configuration components
│   │   └── TargetSettingForm.jsx
│   ├── reports/             # Report generation & preview components
│   │   ├── ReportExporter.jsx
│   │   └── PrintView.jsx
│   └── users/               # Administrative user management components
│       ├── UserTable.jsx
│       └── UserAssignmentModal.jsx
├── context/                 # Global React Context providers
│   ├── AuthContext.jsx      # Session state, user profile, role hydration
│   ├── TenantContext.jsx    # Current tenant configuration & settings
│   └── FilterContext.jsx    # Date range filters (YTD, YoY, quarterly)
├── data/                    # Static mock data / constants for development
│   └── initialProjects.js
├── hooks/                   # Custom React Hooks encapsulating business logic
│   ├── useAuth.js           # Auth Context accessor
│   ├── useProjects.js       # Dynamic project list fetcher based on role
│   ├── useSales.js          # Sales CRUD operations & RPC caller
│   ├── useExpenses.js       # Expense entry & CEO approval state
│   ├── useDashboard.js      # Aggregated metrics fetcher
│   └── useReports.js        # Export trigger hooks (jsPDF / SheetJS)
├── layouts/                 # Master Layout Wrappers & Navigation
│   ├── RootLayout.jsx       # Base layout with sidebar and navbar
│   └── ProtectedLayout.jsx  # Role-based route authorization guard
├── pages/                   # Top-level Page Views mapped to router paths
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx    # Accessible by CEO & Director
│   ├── ProjectDetailPage.jsx# Accessible by CEO, Director, & assigned PM
│   ├── SalesEntryPage.jsx   # Accessible by PM & CEO
│   ├── ExpenseEntryPage.jsx # Accessible by PM & CEO
│   ├── ApprovalsPage.jsx    # Accessible by CEO & Super Admin
│   ├── TargetsPage.jsx      # Accessible by CEO & Super Admin
│   ├── ReportsPage.jsx      # Accessible by CEO, Director, Admin
│   ├── UserManagementPage.jsx # Accessible by Admin & Super Admin
│   ├── SettingsPage.jsx     # Accessible by Admin & CEO
│   └── NotFoundPage.jsx
├── services/                # Supabase SDK bindings & external API calls
│   ├── supabaseClient.js    # Singleton Supabase JS client initializer
│   ├── authService.js
│   ├── salesService.js
│   ├── expenseService.js
│   ├── sharedExpenseService.js
│   ├── projectService.js
│   └── reportService.js
└── utils/                   # Pure utility functions & formatters
    ├── currencyFormatter.js # RM currency formatting helper
    ├── dateFormatter.js     # Malaysian date formatters (DD/MM/YYYY)
    ├── exportPdf.js         # jsPDF utility builder
    ├── exportExcel.js       # SheetJS utility builder
    └── rbacHelpers.js       # Client-side permission checks
```

### 3.2 Role-Based Routing & Navigation Layout

The application utilizes dynamic client-side routing with **Role-Based Guards** enforced by `ProtectedLayout`.

#### Role Access Matrix & Route Map

| Page Route | Path | Super Admin | CEO | Director | Project Manager | Admin |
|---|---|---|---|---|---|---|
| **Login** | `/login` | Public | Public | Public | Public | Public |
| **Executive Dashboard** | `/dashboard` | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Project Detail View** | `/projects/:id` | ✅ | ✅ | ✅ | ✅ (Assigned) | ✅ |
| **Sales Entry** | `/sales/new` | ✅ | ✅ | ❌ | ✅ (Assigned) | ❌ |
| **Expense Entry** | `/expenses/new` | ✅ | ✅ | ❌ | ✅ (Assigned) | ❌ |
| **Expense Approvals** | `/expenses/approvals` | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Target & KPI Settings** | `/targets` | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Reports Engine** | `/reports` | ✅ | ✅ | ✅ | ❌ | ❌ |
| **User Management** | `/users` | ✅ | ❌ | ❌ | ❌ | ✅ |
| **System Settings** | `/settings` | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Audit Trail** | `/audit-log` | ✅ | ✅ | ❌ | ❌ | ✅ |

#### Route Guard Logic (`ProtectedLayout.jsx`)

```jsx
// Simplified Guard Structure
const ProtectedLayout = ({ allowedRoles }) => {
  const { user, profile, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(profile?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <RootLayout>
      <Outlet />
    </RootLayout>
  );
};
```

### 3.3 State Management Paradigm

To maintain performance, modularity, and maintainability without introducing unnecessary state management libraries (such as Redux or Zustand), state management relies on **React Context** combined with custom **React Hooks**:

1. **`AuthContext`**: Manages global authentication session, active user token, user profile record (`profiles`), active tenant ID, and user role (`user_role`).
2. **`FilterContext`**: Holds active dashboard global filters (selected month, financial year, project filter, date range comparisons: YTD, YoY, 3-Month).
3. **Domain Custom Hooks (`useSales`, `useExpenses`, `useProjects`)**: Encapsulate async API requests to Supabase PostgREST endpoints and RPCs, handling loading, error states, and optimistic UI updates locally.

---

## 4. Backend & Database Architecture

The backend infrastructure leverages PostgreSQL 15+ provided by Supabase, enforcing zero-trust data access policies and storage rules directly in the database engine.

### 4.1 Row Level Security (RLS) Paradigm

Database security is enforced via PostgreSQL **Row Level Security (RLS)**. No query from the client can bypass these policies.

#### RLS Helper Functions

To eliminate repetitive SQL logic and maximize execution speed, two PL/pgSQL `SECURITY DEFINER` functions are created:

1. `get_current_user_profile()`: Returns the profile ID, `tenant_id`, and `role` of the currently authenticated user session (`auth.uid()`).
2. `is_project_assigned(p_project_id)`: Checks whether the authenticated `project_manager` is assigned to `p_project_id` in `user_project_assignments`.

#### Summary of Table RLS Rules

| Table | Policy Summary |
|---|---|
| **`tenants`** | Users can only `SELECT` the tenant record corresponding to their own `tenant_id`. |
| **`profiles`** | All active users can `SELECT` profiles in their tenant. Only `super_admin` & `admin` can `INSERT` / `UPDATE`. |
| **`projects`** | `super_admin`, `ceo`, `director`, `admin` can `SELECT` all projects. `project_manager` can only `SELECT` assigned projects. `admin` can `INSERT`/`UPDATE`. |
| **`sales_entries`** | `SELECT`: Execs & Admins (all), PM (assigned projects). `INSERT`/`UPDATE`: Execs & assigned PM. |
| **`expense_entries`** | `SELECT`: Execs & Admins (all), PM (assigned projects). `INSERT`: Execs & assigned PM. `UPDATE`: PM can update only if `status = 'pending'`. CEO & `super_admin` can update `status` (`approved`/`rejected`). |
| **`shared_expenses`** | Execs & Admins can `SELECT`/`INSERT`/`UPDATE`. PM has no access. |
| **`project_targets`** | `SELECT`: All authenticated tenant users. `INSERT`/`UPDATE`: `ceo` & `super_admin` only. |
| **`system_settings`** | `SELECT`: All authenticated tenant users. `UPDATE`: `admin`, `ceo`, `super_admin`. |
| **`audit_logs`** | `SELECT`: `super_admin`, `ceo`, `admin` only. Modifiable only by automated system triggers. |

---

### 4.2 Storage Architecture & Access Rules

All physical documents (expense receipts, invoices, proof of payment) are stored in a private Supabase Storage bucket named **`expense-receipts`**.

#### Storage Folder Hierarchy
```
expense-receipts/ (Private Bucket)
└── {tenant_id}/
    └── {project_id}/
        └── {year}/
            └── {expense_entry_id}-{filename}
```

#### Supabase Storage RLS Policies

```sql
-- 1. Enable Storage Policy for Upload (INSERT)
CREATE POLICY "Allow Upload Receipt for Assigned Project"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'expense-receipts' AND
  (
    (SELECT role FROM public.get_current_user_profile()) IN ('super_admin', 'ceo')
    OR
    (
      (SELECT role FROM public.get_current_user_profile()) = 'project_manager' AND
      public.is_project_assigned((storage.foldername(name))[2]::uuid)
    )
  )
);

-- 2. Enable Storage Policy for Download / View (SELECT)
CREATE POLICY "Allow Read Receipt for Tenant Users"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'expense-receipts' AND
  (storage.foldername(name))[1]::uuid = (SELECT tenant_id FROM public.get_current_user_profile())
);
```

---

### 4.3 Edge Functions & CRON Scheduling

Background asynchronous tasks and automated operations are handled by Deno-based **Supabase Edge Functions** combined with PostgreSQL `pg_cron` / `pg_net` or Supabase Cloud Scheduled Triggers.

```
+------------------+         +-------------------------+         +-----------------------+
|  Trigger Event   |  -----> |   Database Webhook /    |  -----> | Supabase Edge         |
|  (DB / Schedule) |         |   pg_cron HTTP Call     |         | Function (Deno)       |
+------------------+         +-------------------------+         +-----------------------+
                                                                             |
                                                                             v
                                                                 +-----------------------+
                                                                 | SMTP Email Gateway    |
                                                                 | (Nodemailer / Smtp)   |
                                                                 +-----------------------+
```

#### Edge Functions Specification

1. **`expense-approval-notifier`**:
   - **Invocation:** Triggered via Database Webhook on `UPDATE` of `expense_entries` when status changes from `pending` to `approved` or `rejected`.
   - **Action:** Retrieves PM email (`created_by`), constructs notification body (including rejection reason if applicable), and sends email via SMTP gateway.
2. **`monthly-report-scheduler`**:
   - **Invocation:** Scheduled CRON trigger running on the **1st of every month at 00:00 MYT** (`0 0 1 * *`).
   - **Action:** Generates PDF summary report & Excel export for the concluded month, uploads files to storage bucket `reports/`, and sends email attachments to configured recipients (`CEO`, `Board Members`, `Finance Team`).
3. **`deadline-warning-reminder`**:
   - **Invocation:** Scheduled CRON trigger running daily at 09:00 MYT, checking `system_settings.monthly_submission_deadline_day`.
   - **Action:** Identifies projects missing entries for the active month, dispatching reminder emails to assigned Project Managers (CCing CEO if deadline passed).

---

## 5. Portability Strategy

To ensure zero vendor lock-in and complete flexibility based on executive budget constraints, the platform is designed to operate seamlessly across three deployment environments **without altering application source code**.

### 5.1 Config-Driven Environment Variable Standard

All infrastructure bindings, authentication keys, and service URLs are strictly injected via environment variables.

#### Client Environment Variables (`.env` / `.env.production`)
```env
# Supabase Backend Configuration
VITE_SUPABASE_URL=https://your-supabase-instance.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Client Application Branding Default
VITE_APP_TITLE="Business Command Centre — Kop-Pusamaju"
```

#### Backend / Edge Functions Environment Variables (`.env.edge`)
```env
SUPABASE_URL=https://your-supabase-instance.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# SMTP Configuration for Email Alerts
SMTP_HOST=mail.pusamaju.com.my
SMTP_PORT=587
SMTP_USER=alerts@pusamaju.com.my
SMTP_PASS=SuperSecretSmtpPassword123!
SMTP_FROM_EMAIL=no-reply@pusamaju.com.my
```

### 5.2 Three-Stage Deployment Lifecycle

```
[ Stage 1: Local Dev ]  -------> [ Stage 2: Staging Demo ] -------> [ Stage 3: Production ]
  - Local Docker Stack              - Supabase Cloud Free Tier         - Managed Cloud OR
  - supabase start                  - Vercel / Netlify Frontend        - VPS Self-Hosted Docker
  - Vite Local Server               - Free SSL & Shared DB             - Full Dedicated Stack
```

1. **Stage 1: Local Development (`supabase start`)**
   - Developers run Supabase locally via Docker containers.
   - Vite dev server runs at `http://localhost:5173`.
   - Database migrations and seed scripts are tested locally using standard Supabase CLI (`supabase migration up`).
2. **Stage 2: Staging & Demo (Supabase Cloud Free Tier)**
   - Used for live CEO demonstration and user acceptance testing.
   - Frontend hosted on Vercel/Netlify connected to Supabase Cloud managed project.
3. **Stage 3: Production (Cloud vs VPS Self-Hosted)**
   - **Option A (Managed Cloud):** Host on Supabase Cloud Paid Plan for managed high availability and automatic backups.
   - **Option B (VPS Self-Hosted):** Host on a Linux VPS (e.g., Ubuntu 22.04) running the official Supabase Docker Compose stack.
   - **Migration Process:** Simply export PostgreSQL schema and data using `pg_dump`, import to the target host, and update `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the frontend deployment pipeline. **Zero code refactoring is required.**

---

## 6. Comprehensive System Workflows

This section detailed step-by-step logic for three critical system workflows.

### 6.1 Workflow 1: Authentication & Session Hydration

```
[ User Opens App ] ---> [ Check Local Storage Session ]
                              |
                     +--------+--------+
                     |                 |
             (Session Found)    (No Session)
                     |                 |
                     v                 v
            [ Verify JWT Token ]  [ Redirect to /login ]
                     |                 |
                     v                 |
            [ Fetch User Profile ]     |
            [ & Role from DB ]         v
                     |            [ User Credentials Submitted ]
                     v                 |
            [ Hydrate Auth Context ]   v
                     |            [ Supabase Auth Sign-In ]
                     v                 |
            [ Redirect to Role ] <-----+
            [ Default Route ]
```

#### Detailed Step-by-Step Logic:

1. **Initialization:**
   - On application initial boot (`index.html` loading `App.jsx`), `AuthContext` initializes the Supabase client and calls `supabase.auth.getSession()`.
2. **Session Verification:**
   - If a valid JWT token exists in browser local storage, Supabase Auth verifies the token signature against the public key.
   - If the token is invalid or expired, `supabase.auth.refreshSession()` attempts to fetch a new token using the refresh token. If failed, the user is redirected to `/login`.
3. **Profile & Role Hydration:**
   - Upon successful session validation, `AuthContext` issues a REST request to `/profiles?id=eq.{user_id}&select=*`.
   - The user's `full_name`, `email`, `role`, `tenant_id`, and `is_active` status are retrieved and loaded into `AuthContext` state.
4. **Tenant Settings Hydration:**
   - `TenantContext` queries `system_settings` using the retrieved `tenant_id` to establish thresholds and rules.
5. **Role-Based Navigation Routing:**
   - The user is directed to their landing page based on role:
     - **CEO / Director / Super Admin:** `/dashboard`
     - **Project Manager:** `/projects` (or entry page if assigned to 1 project)
     - **Admin:** `/users`

---

### 6.2 Workflow 2: Expense Entry & CEO Approval Workflow

```
[ Project Manager ] ---> [ Uploads Receipt to Storage ] ---> [ Inserts Expense Entry (status: 'pending') ]
                                                                                |
                                                                                v
[ CEO Receives Email ] <--- [ Edge Function Triggered ] <--- [ DB Trigger / Webhook Fires ]
          |
          v
[ CEO Reviews in UI ]
          |
     +----+----+
     |         |
 (Approve)  (Reject)
     |         |
     v         v
[ Update status = 'approved' ] / [ Update status = 'rejected' + reason ]
     |                                      |
     +------------------+-------------------+
                        |
                        v
          [ Audit Log Trigger Records Change ]
                        |
                        v
          [ Edge Function Sends Decision Email to PM ]
```

#### Detailed Step-by-Step Logic:

1. **Submission Phase (Project Manager):**
   - PM navigates to `/expenses/new` and fills out the expense form (date, category, amount, description).
   - PM selects a receipt file. The frontend calls `supabase.storage.from('expense-receipts').upload(...)` storing the file at `{tenant_id}/{project_id}/{year}/{expense_id}.pdf`.
   - Upon successful file upload, PM submits the form. The frontend performs `POST /expense_entries` with default `status = 'pending'`.
   - RLS verifies PM is assigned to the `project_id`.
2. **Notification Phase:**
   - Insertion into `expense_entries` triggers a database webhook / notification to the CEO dashboard.
   - CEO receives an instant pending approval alert on their dashboard badge and an automated email reminder.
3. **Review & Approval Phase (CEO):**
   - CEO logs in and navigates to `/expenses/approvals`.
   - CEO inspects pending entries, reviews attached receipt image/PDF via signed URL.
   - CEO selects **Approve** or **Reject**:
     - If **Approved**: CEO executes `PATCH /expense_entries?id=eq.{id}` setting `status = 'approved'`, `reviewed_by = {ceo_id}`, `reviewed_at = now()`.
     - If **Rejected**: CEO opens `RejectionModal`, enters a compulsory reason, and executes `PATCH` setting `status = 'rejected'`, `rejection_reason = {text}`, `reviewed_by = {ceo_id}`, `reviewed_at = now()`.
4. **Post-Review Processing:**
   - The `audit_trail_trigger_func()` automatically logs the update event into `audit_logs`.
   - An asynchronous DB webhook triggers the Deno Edge Function `expense-approval-notifier`.
   - The Edge Function emails the PM informing them of the approval or rejection decision.

---

### 6.3 Workflow 3: Proportional Shared Cost Allocation

```
[ Admin / CEO Enters Corporate Shared Expense ]
                      |
                      v
[ System Settings Check: Allocation Method ]
                      |
          +-----------+-----------+
          |                       |
   (Method = Manual)    (Method = Proportional)
          |                       |
          v                       v
[ User Manually Inputs   [ Frontend / Admin Executes RPC: ]
  Amounts per Project ]  [ calculate_shared_expense_allocations() ]
          |                       |
          +-----------+-----------+
                      |
                      v
[ RPC Computes Sales Revenue Ratios for Active Month ]
                      |
                      v
[ Inserts Allocation Splits into shared_expense_allocations ]
                      |
                      v
[ Executive Dashboard Instantly Updates Project Net Profitability ]
```

#### Detailed Step-by-Step Logic:

1. **Shared Expense Entry:**
   - CEO or Admin navigates to `/expenses/shared` and records an overhead expense incurred at headquarters (e.g., HQ Rent RM 10,000 or Utilities RM 2,000).
   - User inputs `expense_date`, `total_amount`, `category`, `description`, and selects `allocation_method` (`manual` vs `proportional_by_revenue`).
2. **Allocation Calculation Logic (`proportional_by_revenue`):**
   - When set to `proportional_by_revenue`, the application invokes backend RPC procedure: `POST /rest/v1/rpc/calculate_shared_expense_allocations` passing `p_shared_expense_id`.
   - The stored procedure performs the following mathematical logic in a single atomic database transaction:
     
     a. Determines the target calendar month and year of the shared expense.  
     b. Sums the total approved sales revenue across **all active projects** for that month:
        $$\text{Total System Revenue} = \sum \text{Project Sales}$$
     c. For each individual active project $i$, calculates its revenue contribution ratio:
        $$\text{Ratio}_i = \frac{\text{Project Revenue}_i}{\text{Total System Revenue}}$$
     d. Multiplies the ratio by the total shared expense amount to determine each project's allocated burden:
        $$\text{Allocated Amount}_i = \text{Total Shared Expense} \times \text{Ratio}_i$$
     e. Inserts or updates the computed breakdown records into `shared_expense_allocations`.

3. **Dashboard Real-Time Updates:**
   - The executive dashboard calculates net profit per project using total direct revenue, minus direct approved project expenses, minus allocated shared overhead:
     $$\text{Net Profit}_i = \text{Direct Revenue}_i - \text{Direct Approved Expenses}_i - \text{Allocated Shared Expense}_i$$
   - Project profitability metrics and KPI cards instantly refresh across the dashboard.

---

## 7. Security & Non-Functional Requirements Matrix

| Requirement Domain | Target Metric / Standard | Technical Implementation Strategy |
|---|---|---|
| **Response Time** | Dashboard load time **< 3 seconds** | Composite B-Tree indexes on `(tenant_id, project_id, date)`, server-side RPC aggregation, lightweight React SPA bundle. |
| **Data Security** | Zero unauthorized data exposure | PostgreSQL Row Level Security (RLS) on 100% of public tables; JWT session validation; HTTPS encryption in transit. |
| **Concurrency** | Min 50 concurrent active users | PostgREST stateless connection pooling, optimized SQL RPC calls. |
| **Auditability** | 100% mutation tracking | Automated PL/pgSQL triggers (`audit_trail_trigger_func`) capturing `INSERT`, `UPDATE`, `DELETE` operations with `old_data` and `new_data` JSONB snapshots. |
| **Uptime** | 99% System Availability | Decoupled client SPA hosted on CDN; stateless Supabase backend services; containerized self-hosting capabilities. |
| **Data Integrity** | Zero orphaned records | PostgreSQL FK Constraints with `RESTRICT` on transactional deletes and strict `CHECK` constraints on financial numerical fields. |

---

*This architecture specification provides the complete technical framework for the Business Command Centre system. Implementation across all modules must adhere strictly to these defined standards.*
