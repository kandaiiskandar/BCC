# API Specification — Business Command Centre

This document defines the integration interfaces, endpoints, database RPCs (Stored Procedures), and Edge Functions for the **Business Command Centre**. These interfaces connect the **React (Vite)** frontend to the **Supabase** backend.

---

## 1. Overview & Connection Standards

All communications with the Supabase backend use HTTPS. The backend automatically exposes REST endpoints for database tables via **PostgREST**, and handles custom transactions, aggregations, and notifications through **RPCs** and **Edge Functions**.

### 1.1 Base URL Endpoints
- **Supabase REST API (CRUD):** `https://<project_ref>.supabase.co/rest/v1`
- **Supabase RPC (Stored Procedures):** `https://<project_ref>.supabase.co/rest/v1/rpc`
- **Supabase Edge Functions:** `https://<project_ref>.supabase.co/functions/v1`

### 1.2 Headers Required
Every API request must include the following headers:

| Header Name | Value | Required | Description |
|---|---|---|---|
| `apikey` | `<anon_key>` | Yes | The Supabase project public anon key. |
| `Authorization` | `Bearer <JWT>` | Yes | User authentication token received after login. |
| `Content-Type` | `application/json` | Yes | Required for POST, PATCH, and PUT requests. |
| `Prefer` | `return=representation` | No | Instructs PostgREST to return the inserted/updated record. |

### 1.3 Error Response Format
When a request fails, PostgREST returns a standard error body with a `4xx` or `5xx` status code:
```json
{
  "code": "23505",
  "details": "Key (tenant_id, project_id, year, month)=(550e8400-..., 2026, 7) already exists.",
  "hint": null,
  "message": "duplicate key value violates unique constraint \"project_targets_tenant_id_project_id_year_month_key\""
}
```

---

## 2. Standard Filters, Sorting, and Pagination

PostgREST allows advanced filtering and manipulation of resources directly via URL query parameters.

### 2.1 Operators
- **Equals:** `?status=eq.pending`
- **Not Equals:** `?status=neq.rejected`
- **In list:** `?revenue_type=in.(regular,recurring)`
- **Comparison:** `?amount=gte.1000&amount=lte.5000`
- **Pattern Matching:** `?name=ilike.*Ar-rahnu*` (case-insensitive)
- **Null check:** `?receipt_url=is.null`

### 2.2 Joins (Foreign Key Relations)
To retrieve related records in a single query:
- Get projects with their target info: `/projects?select=*,project_targets(*)`
- Get sales entries with project names: `/sales_entries?select=*,projects(name)`

### 2.3 Sorting & Pagination
- **Sorting:** `?order=sale_date.desc`
- **Pagination:** `?limit=10&offset=20` (Fetches items 21-30)

---

## 3. Table-Based REST Endpoints (PostgREST)

### 3.1 `/projects`
Manages cooperative projects.

- **`GET /projects`**
  - **Access:** Super Admin, CEO, Director, Admin (all projects); Project Manager (only assigned projects).
  - **Query Example:** `GET /projects?select=id,name,code,industry&is_active=eq.true`
  - **Response (200 OK):**
    ```json
    [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Ar-rahnu",
        "code": "ARH",
        "industry": "Perkhidmatan Kewangan Islam"
      }
    ]
    ```
- **`POST /projects`**
  - **Access:** Super Admin, Admin.
  - **Payload:** `{ "tenant_id": "uuid", "name": "Pasaraya", "code": "PSR", "industry": "Runcit" }`
- **`PATCH /projects?id=eq.{id}`**
  - **Access:** Super Admin, Admin.
  - **Payload:** `{ "is_active": false }`

---

### 3.2 `/sales_entries`
Records sales inputs submitted by Project Managers.

- **`GET /sales_entries`**
  - **Access:** Super Admin, CEO, Director (all entries); Project Manager (only assigned projects).
  - **Query Example:** `GET /sales_entries?select=*,projects(name)&sale_date=gte.2026-07-01`
  - **Response (200 OK):**
    ```json
    [
      {
        "id": "770e8400-e29b-41d4-a716-446655440099",
        "tenant_id": "11111111-1111-1111-1111-111111111111",
        "project_id": "550e8400-e29b-41d4-a716-446655440001",
        "sale_date": "2026-07-15",
        "amount": 25000.00,
        "revenue_type": "recurring",
        "client_name": "Syarikat Maju Sdn Bhd",
        "product_service_name": "Langganan Bulanan",
        "payment_method": "bank_transfer",
        "invoice_ref": "INV-2026-001",
        "notes": "Paid on time",
        "projects": { "name": "Ar-rahnu" }
      }
    ]
    ```
- **`POST /sales_entries`**
  - **Access:** Super Admin, CEO, Project Manager (for assigned projects).
  - **Payload:**
    ```json
    {
      "tenant_id": "11111111-1111-1111-1111-111111111111",
      "project_id": "550e8400-e29b-41d4-a716-446655440001",
      "sale_date": "2026-07-26",
      "amount": 4500.00,
      "revenue_type": "regular",
      "client_name": "Walk-in Customer",
      "product_service_name": "Pawn Service Fee",
      "payment_method": "cash"
    }
    ```
- **`PATCH /sales_entries?id=eq.{id}`**
  - **Access:** Super Admin, CEO, Project Manager (for assigned projects).

---

### 3.3 `/expense_entries`
Records project expenses. Subject to CEO approval workflow.

- **`GET /expense_entries`**
  - **Access:** Super Admin, CEO, Director (all entries); Project Manager (only assigned projects).
  - **Query Example:** `GET /expense_entries?status=eq.pending`
- **`POST /expense_entries`**
  - **Access:** Super Admin, CEO, Project Manager (for assigned projects).
  - **Constraint:** Status defaults to `pending`.
  - **Payload:**
    ```json
    {
      "tenant_id": "11111111-1111-1111-1111-111111111111",
      "project_id": "550e8400-e29b-41d4-a716-446655440001",
      "expense_date": "2026-07-25",
      "category": "utilities",
      "amount": 350.00,
      "description": "Bil elektrik pejabat Julai 2026",
      "receipt_url": "receipts/11111111-1111-1111-1111-111111111111/elec-bill.pdf"
    }
    ```
- **`PATCH /expense_entries?id=eq.{id}`**
  - **Access:**
    - Project Manager: Can modify entries *only* if `status = 'pending'`.
    - CEO, Super Admin: Can modify `status` to `'approved'` or `'rejected'`. Must provide `rejection_reason` if rejected.
  - **Payload Example (CEO Approval):**
    ```json
    {
      "status": "approved",
      "reviewed_by": "b1111111-2222-3333-4444-555555555555",
      "reviewed_at": "2026-07-26T14:30:00Z"
    }
    ```
  - **Payload Example (CEO Rejection):**
    ```json
    {
      "status": "rejected",
      "reviewed_by": "b1111111-2222-3333-4444-555555555555",
      "reviewed_at": "2026-07-26T14:32:00Z",
      "rejection_reason": "Resit tidak jelas. Sila muat naik fail yang beresolusi tinggi."
    }
    ```

---

### 3.4 `/project_targets`
Configuration of project goals.

- **`GET /project_targets`**
  - **Access:** Super Admin, CEO, Director, PM (View goals).
  - **Query Example:** `GET /project_targets?project_id=eq.550e8400-e29b-41d4-a716-446655440001&year=eq.2026`
- **`POST /project_targets`**
  - **Access:** Super Admin, CEO.
- **`PATCH /project_targets?id=eq.{id}`**
  - **Access:** Super Admin, CEO.

---

### 3.5 `/profiles`
User management.

- **`GET /profiles`**
  - **Access:** Super Admin, Admin, CEO.
- **`PATCH /profiles?id=eq.{id}`**
  - **Access:** Super Admin, Admin (full modification); Owner (can edit own full_name/email only).

---

## 4. Custom RPC Functions (Stored Procedures)

Exposed via `POST /rest/v1/rpc/{function_name}`.

### 4.1 `calculate_shared_expense_allocations`
Executes project-level shared cost splits in a single transaction.

- **Endpoint:** `POST /rest/v1/rpc/calculate_shared_expense_allocations`
- **Parameters:**
  ```json
  {
    "p_shared_expense_id": "UUID"
  }
  ```
- **Execution Logic:**
  1. Retrieves the shared expense record.
  2. If `allocation_method = 'proportional_by_revenue'`:
     - Computes total sales revenue for that month.
     - Projects get a proportion of the shared expense equal to their revenue percentage.
     - Saves allocations in `shared_expense_allocations`.
  3. If `allocation_method = 'manual'`:
     - Keeps allocations defined manually in the UI (does not recalculate proportions).
- **Response (200 OK):**
  ```json
  true
  ```

---

### 4.2 `get_dashboard_summary`
Aggregates top-level KPI metrics in a highly performant query.

- **Endpoint:** `POST /rest/v1/rpc/get_dashboard_summary`
- **Parameters:**
  ```json
  {
    "p_year": 2026,
    "p_month": 7
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "total_sales": 1568200.50,
    "total_expenses": 724100.20,
    "net_profit": 844100.30,
    "projects_meeting_targets": 7,
    "projects_warning": 2,
    "projects_failing": 1,
    "total_active_projects": 10
  }
  ```

---

### 4.3 `get_project_monthly_trend`
Generates aggregated data sets structured for Recharts frontend visualizations.

- **Endpoint:** `POST /rest/v1/rpc/get_project_monthly_trend`
- **Parameters:**
  ```json
  {
    "p_project_id": "UUID",
    "p_months_limit": 6
  }
  ```
- **Response (200 OK):**
  ```json
  [
    {
      "month": "Feb 2026",
      "sales": 85000.00,
      "expenses": 42000.00,
      "profit": 43000.00
    },
    {
      "month": "Mac 2026",
      "sales": 92000.00,
      "expenses": 46000.00,
      "profit": 46000.00
    }
  ]
  ```

---

## 5. Supabase Edge Functions (Serverless Deno Services)

Invoked under `https://<project_ref>.supabase.co/functions/v1/{function_name}`.

### 5.1 `expense-approval-notifier`
Triggered automatically via a database webhook on UPDATE of `expense_entries` status.

- **Trigger Event:** `UPDATE` status from `pending` to `approved` or `rejected`.
- **Action:** 
  1. Looks up the email of the PM (`created_by`) and the CEO (`reviewed_by`).
  2. Sends an email informing the PM of the decision and the rejection reason (if rejected).

---

### 5.2 `monthly-report-scheduler`
Triggered via CRON schedule on the 1st of every month at 12:00 AM (MYT).

- **CRON Schedule:** `0 0 1 * *`
- **Action:**
  1. Queries aggregated monthly sales, expenses, allocations, and targets for the prior month.
  2. Generates an Excel spreadsheet using SheetJS and a PDF report using jsPDF.
  3. Uploads the generated reports to a private Supabase Storage bucket (`reports/`).
  4. Retrieves the email distribution list from `system_settings.auto_report_recipients`.
  5. Sends the reports via SMTP to configured email addresses.

---

### 5.3 `deadline-warning-reminder`
Triggered via CRON schedule on the configured submission deadline day (defined in `system_settings.monthly_submission_deadline_day`).

- **CRON Schedule:** Daily check or pinned to deadline day.
- **Action:**
  1. Checks which projects *do not* have a sales or expense submission for the current calendar month.
  2. Sends email warnings to the assigned Project Managers, reminding them to complete their data entry.
  3. CCs the CEO if entries remain empty past the deadline date.
