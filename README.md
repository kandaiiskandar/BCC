# Business Command Centre — Kop-Pusamaju

**Client:** Koperasi Pembangunan Usahasama Masyarakat Maju Sabah Berhad (Kop-Pusamaju)  
**Team:** 1 Product Manager · 1 Software Engineer (Iskandar)  
**Status:** 🟢 Fasa 1 — Dalam Pembangunan  
**Last Updated:** 26 July 2026

---

## Project Overview

A centralised **Business Command Centre** for the CEO to monitor revenue, expenses, profit/loss, KPIs, and team performance across multiple income sources in real time.

**Visi jangka panjang:** Dijual kepada koperasi-koperasi lain di Malaysia sebagai produk SaaS komersial.

---

## Folder Structure

```
sales-project/
│
├── 00_admin/               # Product vision, project plan, team info
├── 01_discovery/           # CEO survey responses, requirements gathering
├── 02_requirements/        # (Reserved for future use)
├── 03_design/              # Wireframes, UI mockups
├── 04_development/         # All development work (specs, docs, source code)
│   ├── specs/              # Technical spec, data model, API spec
│   ├── docs/               # Architecture, tech stack, dev notes
│   ├── supabase/           # DB migrations & seed data
│   └── src/                # React source code
├── 05_testing/             # Test plans, QA checklist, bug reports
├── 06_reports/             # Generated reports and exports
└── 07_handover/            # Deployment guide, user manual
```

---

## Team

| Role | Name | Responsibility |
|---|---|---|
| Product Manager | — | Requirements, roadmap, CEO communication |
| Software Engineer | Iskandar | Architecture, development, deployment |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Charts | Recharts |
| Backend & Database | Supabase (PostgreSQL + Auth + Storage + Realtime) |
| Export | SheetJS (Excel) + jsPDF (PDF) — client-side |
| Email Alerts | SMTP |
| Local Dev | `supabase start` + `pnpm dev` |
| Demo / Testing | Supabase Cloud (free tier) |
| Production | Supabase self-hosted / Cloud — ikut bajet CEO |

---

## Project Phases

| Phase | Name | Status |
|---|---|---|
| 0 | Discovery & Requirements | ✅ Selesai |
| 1 | MVP Dashboard | 🟢 Dalam Pembangunan |
| 2 | Integrasi (QuickBooks, SQL, Penggajian) | ⬜ Belum Mula |
| 3 | AI & Analytics | ⬜ Belum Mula |
| 4 | Pengembangan SaaS (White-label) | ⬜ Belum Mula |
| 5 | Multi-Tenancy | ⬜ Belum Mula |

---

## Fasa 1 — Status Pembangunan

### ✅ Selesai
| Bahagian | Perkara |
|---|---|
| **Specs** | Technical Spec, Data Model (PostgreSQL schema + RLS + triggers), API Spec |
| **Docs** | Architecture, Tech Stack, Test Accounts, Dev Notes |
| **Backend** | Supabase migrations, seed data (10 projek, 4 akaun ujian) |
| **Frontend** | Scaffolding — AuthContext, ProtectedRoute, MainLayout, formatters, supabaseClient |
| **Screens** | Login, Sales Entry (PM) |

### 🔜 Dalam Proses / Seterusnya
| Skrin | Peranan |
|---|---|
| Expense Entry + Approval Workflow | Pengurus Projek + CEO |
| CEO Executive Dashboard | CEO |
| Admin — User Management & Settings | Admin |

### ⬜ Belum Mula
- KPI & Performance scoring
- Laporan automatik (PDF, Excel, Google Sheets)
- Sistem amaran email
- Perbandingan tahun ke tahun (YoY)

---

## Quick Start (Local Development)

```bash
# 1. Jalankan Supabase backend (dalam 04_development/)
supabase start

# 2. Jalankan React frontend
pnpm dev
```

**Akaun Ujian (Password: `Password123!`)**

| Role | Email |
|---|---|
| CEO | ceo@koperasi.my |
| Pengurus Projek | pm@koperasi.my |
| Director | director@koperasi.my |
| Admin | admin@koperasi.my |

---

## Quick Links

| Dokumen | Lokasi |
|---|---|
| Product Vision | `00_admin/Product_Vision.md` |
| Project Plan | `00_admin/Sales_Dashboard_Project_Plan.md` |
| CEO Survey Responses | `01_discovery/CEO_Survey_Responses.md` |
| Technical Spec | `04_development/specs/technical-spec.md` |
| Data Model | `04_development/specs/data-model.md` |
| API Spec | `04_development/specs/api-spec.md` |
| Architecture | `04_development/docs/architecture.md` |
| Tech Stack | `04_development/docs/tech-stack.md` |
| Dev Notes & Progress | `04_development/docs/dev-notes.md` |
| Test Accounts | `04_development/docs/test-accounts.md` |
