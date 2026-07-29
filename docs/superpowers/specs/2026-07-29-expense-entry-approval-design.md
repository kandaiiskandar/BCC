# Expense Entry & Approval Workflow — Design Spec

**Date:** 29 July 2026  
**Status:** Approved for implementation  
**Scope:** Fasa 1 MVP — replaces App.jsx placeholder stubs for `/expense-entry` and `/expense-approvals`

## 1. Overview

Two tightly-coupled screens implementing the full expense workflow: PM submits expenses → CEO approves/rejects. The `expense_entries` table, RLS policies, and sidebar nav items already exist in the codebase.

## 2. Key Decisions

| Decision | Rationale |
|---|---|
| Receipt upload: **text field only** (skip file upload) | Keep scope lean; add Supabase Storage upload later |
| PMs can **edit** pending expenses | RLS already allows UPDATE while `status='pending'` |
| **Separate pages** for entry vs approvals | Follows existing sidebar nav; different user roles |
| Build **both screens together** | They're coupled — approvals screen is useless without expenses |

## 3. Files

### New Files
- `pages/pm/ExpenseEntry.jsx` — PM form + personal history table
- `pages/ceo/ExpenseApprovals.jsx` — CEO approval queue + review history
- `hooks/useExpenses.js` — all expense CRUD + approval mutations

### Modified Files
- `App.jsx` — replace ExpenseEntry stub with real import, add `/expense-approvals` route
- `utils/formatters.js` — add `getExpenseCategoryLabel()` and `getExpenseStatusLabel()`

### No Change
- `MainLayout.jsx` — sidebar already has "Rekod Perbelanjaan" and "Kelulusan Belanja" items
- Database — `expense_entries` table and RLS policies already deployed

## 4. Screen Specs

### 4.1 Expense Entry (`/expense-entry`)
**Access:** PM, CEO, Super Admin

**Left panel — form:**
- Project dropdown (RLS-filtered), Date picker, Category (10 ENUM options), Amount (RM), Description (textarea), Receipt URL (optional text input)
- Two modes: **Create** (fresh form) and **Edit** (click pending row to pre-fill)
- Cancel button to exit edit mode
- Form resets after successful submit (stays in create mode)

**Right panel — history table:**
- Columns: Project, Date, Category · Description, Amount, Status badge, Actions
- Edit + Delete available only on rows with `status='pending'`
- Status badges: 🟡 Menunggu / 🟢 Diluluskan / 🔴 Ditolak

### 4.2 Expense Approvals (`/expense-approvals`)
**Access:** CEO, Super Admin only  

**Pending tab:**
- List of all pending expenses across all projects
- Each row: Project name, PM name, Category, Date, Amount, Description, Receipt link
- Approve button (green) — immediate, no confirmation needed
- Reject button (red) — prompt for mandatory reason text

**History tab:**
- Previously reviewed expenses (approved + rejected)
- Shows: reviewer name, review date, rejection reason if any

## 5. Data Hook (`useExpenses`)

Follows the `useSales` pattern exactly:

```js
export function useExpenses(projectId = null) {
  // State: expenses[], loading, error
  // Methods:
  //   fetchExpenses() — auto-filtered by RLS, ordered by date desc
  //   addExpense(data) — INSERT
  //   updateExpense(id, data) — UPDATE while pending
  //   deleteExpense(id) — DELETE while pending
  //   approveExpense(id) — UPDATE status='approved'
  //   rejectExpense(id, reason) — UPDATE status='rejected'
  return { expenses, loading, error, addExpense, updateExpense, deleteExpense, approveExpense, rejectExpense, refetch }
}
```

## 6. Formatters to Add

```js
getExpenseCategoryLabel(cat) → BM label (e.g., 'salaries_wages' → 'Gaji & Upah')
getExpenseStatusLabel(status) → BM label with emoji (e.g., 'pending' → '🟡 Menunggu')
```

## 7. Routes to Add in App.jsx

```jsx
// New: CEO approvals route
<Route path="/expense-approvals" element={
  <ProtectedRoute allowedRoles={['ceo', 'super_admin']}>
    <ExpenseApprovals />
  </ProtectedRoute>
} />
```

Replace inline `ExpenseEntry` stub with `import ExpenseEntry from './pages/pm/ExpenseEntry'`.

## 8. Out of Scope

- File upload (receipt) — text field only
- Expense categories — already in DB as ENUM
- Approval notifications/emails — not in Fasa 1
- Batch approve/reject — single-item only
- Shared expenses (`shared_expenses` table) — separate feature
