# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Business Command Centre** — a web-based sales monitoring and management dashboard being built for **Kop-Pusamaju** (Koperasi Pembangunan Usahasama Masyarakat Maju Sabah Berhad) as a pilot customer, with a long-term vision to sell it to other Malaysian cooperatives as a SaaS product.

**Current status:** Discovery / pre-development. No source code exists yet. The `04_development/src/` directory is empty pending development kickoff.

**Team:** 1 Product Manager (requirements, CEO communication) + 1 Engineer (Iskandar — architecture, development).

## Development Commands

Once development begins (React + Supabase):

```bash
# Local Supabase backend
supabase start        # Start local Supabase (DB + Auth + API)
supabase stop         # Stop local Supabase
supabase db reset     # Reset DB and re-run migrations

# Frontend (React + Vite, once scaffolded)
pnpm dev              # Start React dev server
pnpm build            # Production build
pnpm lint             # Lint check
```

All configuration (Supabase URL, anon key, SMTP credentials) must live in environment variables — never hardcoded.

## Tech Stack (Decided)

| Layer | Technology |
|---|---|
| Frontend | React (JSX) |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Backend + DB + Auth | Supabase (PostgreSQL + Row Level Security) |
| Export | SheetJS (.xlsx) + jsPDF (.pdf) |
| Email alerts | SMTP (via Supabase Edge Functions) |
| Hosting (dev) | Local (`supabase start` + `npm run dev`) |
| Hosting (demo/prod) | Supabase Cloud + Vercel/Netlify |

The system must be portable between local → Supabase Cloud → self-hosted Supabase **without code changes** — use environment variables for all configuration.

## Architecture Constraints (Non-Negotiable)

These are set in `00_admin/Product_Vision.md` and must guide every technical decision:

1. **Multi-tenancy ready (but not built yet):** Fasa 1–4 is single-tenant (Kop-Pusamaju only). However, every DB table must include a `tenant_id` column from day one. Do not make decisions that would require a rewrite to support multi-tenant later.

2. **Project-agnostic:** No project names are hardcoded. Admins add/remove projects through the UI. Every new project automatically gets all features (entry forms, targets, KPIs, reports, alerts).

3. **Modular:** Each module (Sales, Expenses, Reports, KPI, Users) is independent. New modules can be added without touching existing ones.

4. **API-ready:** All core functions must be accessible via the Supabase auto-generated REST API for future integrations (QuickBooks, SQL Accounting, payroll).

5. **Configurable thresholds:** KPI targets, alert thresholds, approval rules, and cost-sharing ratios are user-configurable in Settings — never hardcoded.

## Roles & Access Control

Implemented via Supabase Row Level Security (RLS):

| Role | Key permissions |
|---|---|
| Super Admin | Full access to all data and settings |
| CEO | View all projects, set targets, approve expenses, generate reports |
| Director / Management | View-only across all projects |
| Pengurus Projek (Project Manager) | Entry + view for assigned projects only |
| Admin | User management and system settings |

A Project Manager can be assigned to multiple projects. RLS must enforce project-level data isolation for the Pengurus Projek role.

## Key Business Rules

- All expenses require CEO approval before being confirmed in the system (approval workflow: Pending → Approved/Rejected)
- Monthly reports auto-generate on the 1st of each month and are emailed to configured recipients
- Recurring revenue and advance payments (deposits) are recorded separately from regular sales
- Shared company costs can be allocated to projects either manually or proportionally by revenue (configurable)
- All data mutations are recorded in an audit trail (who, what, when) — use PostgreSQL triggers

## Modules in Scope (Fasa 1)

1. **Dashboard** — KPI cards, charts (bar/line/pie), target vs actual per project, drill-down by project
2. **Sales Entry** — per project, per month; captures revenue type, client, product/service, payment method, invoice ref
3. **Expense Entry** — per project, with category selection, receipt upload (Supabase Storage), and approval workflow
4. **Targets & KPI** — CEO sets monthly revenue and margin targets; system shows 🟢/🟡/🔴 status
5. **Reports** — PDF + Excel export, auto-scheduled email distribution, date range filtering
6. **Email Alerts** — triggered on missed submissions, threshold breaches, expense pending approval
7. **User Management** — create/edit users, assign roles and projects, deactivate accounts

**Out of scope for Fasa 1:** External integrations (QuickBooks, SQL), WhatsApp notifications, AI/forecasting, multi-tenancy, historical data migration.

## Key Documents

| Document | Purpose |
|---|---|
| `00_admin/Product_Vision.md` | Strategic vision and long-term SaaS direction — read before any architectural decision |
| `00_admin/Sales_Dashboard_Project_Plan.md` | Feature list, phased roadmap, open questions |
| `04_development/docs/tech-stack.md` | Tech stack decisions and rationale |
| `04_development/specs/technical-spec.md` | Full Fasa 1 spec — modules, business rules, access matrix, screens |
| `04_development/docs/architecture.md` | Architecture decisions (to be filled by Engineer) |
| `04_development/specs/data-model.md` | DB schema (to be filled by Engineer) |
| `04_development/specs/api-spec.md` | API endpoints (to be filled by Engineer after data model) |

## Language Note

Business documents and user-facing content are in Bahasa Malaysia. Code, comments, and technical documentation should be in English.
