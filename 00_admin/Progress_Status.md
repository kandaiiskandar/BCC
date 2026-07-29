# Status Kemajuan Projek — Business Command Centre (BCC)
**Koperasi Pembangunan Usahasama Masyarakat Maju Sabah Berhad (Kop-Pusamaju)**  
**Tarikh Dikemaskini:** 29 Julai 2026  
**Disediakan oleh:** Product Manager

---

## Ringkasan Keseluruhan

| Fasa | Nama | Status |
|---|---|---|
| 0 | Discovery & Requirements | ✅ Selesai |
| 1 | MVP — Fasa 1 | ✅ Selesai (10/10 skrin) |
| 2 | Integrasi Luaran | ⬜ Belum Mula |
| 3 | AI & Analytics | ⬜ Belum Mula |
| 4 | Pengembangan SaaS | ⬜ Belum Mula |
| 5 | Multi-Tenancy | ⬜ Belum Mula |

---

## Fasa 0 — Discovery ✅ Selesai

- Survey CEO dijalankan dan diproses (46 soalan)
- Keperluan perniagaan disahkan: 10 projek aktif, 5 peranan pengguna, 7 modul
- Visi produk ditetapkan: BCC untuk Kop-Pusamaju → SaaS untuk koperasi Malaysia
- Model harga SaaS dicadangkan (RM 250–900/bulan + setup fee)
- Gap analysis selesai; semua isu dijawab dan didokumenkan

---

## Fasa 1 — MVP (Dalam Pembangunan)

### Dokumentasi & Spesifikasi ✅ Semua Selesai

| Dokumen | Status |
|---|---|
| `00_admin/Product_Vision.md` | ✅ |
| `00_admin/Brief_CEO_Sistem_BCC.md` | ✅ |
| `01_discovery/CEO_Survey_Responses.md` | ✅ |
| `04_development/specs/technical-spec.md` | ✅ |
| `04_development/specs/data-model.md` | ✅ |
| `04_development/specs/api-spec.md` | ✅ |
| `04_development/docs/architecture.md` | ✅ |
| `04_development/docs/tech-stack.md` | ✅ |
| `03_design/wireframes/` (7 skrin) | ✅ |
| `03_design/style-guide.md` | ✅ |

### Backend ✅ Selesai

| Perkara | Status |
|---|---|
| PostgreSQL schema (11 jadual, 6 ENUM, RLS, triggers, indexes) | ✅ |
| Supabase migration `20260726000000_init_schema.sql` | ✅ |
| Seed data: 1 tenant, 10 projek, 4 akaun ujian | ✅ |
| `.env.local` dikonfigurasi | ✅ |
| Supabase Storage bucket `expense-receipts` | ⬜ Belum dibuat (manual) |

### Frontend — Skrin & Komponen ✅ Semua Selesai

| Modul | Fail | Status |
|---|---|---|
| Scaffolding | AuthContext, ProtectedRoute, MainLayout, supabaseClient, formatters | ✅ |
| Log Masuk | `pages/auth/Login.jsx` | ✅ |
| Rekod Jualan (PM) | `pages/pm/SalesEntry.jsx` + `hooks/useSales.js` | ✅ |
| Rekod Perbelanjaan (PM) | `pages/pm/ExpenseEntry.jsx` + `hooks/useExpenses.js` | ✅ |
| Kelulusan Belanja (CEO) | `pages/ceo/ExpenseApprovals.jsx` | ✅ |
| Papan Pemuka (CEO) | `pages/ceo/Dashboard.jsx` + `hooks/useDashboard.js` | ✅ |
| Laporan Kewangan (CEO) | `pages/ceo/Reports.jsx` + `hooks/useReports.js` | ✅ |
| Sasaran & KPI (CEO) | `pages/ceo/TargetsConfig.jsx` + `hooks/useTargets.js` | ✅ |
| Pengurusan Pengguna (Admin) | `pages/admin/UserManagement.jsx` + `hooks/useUsers.js` | ✅ |
| Tetapan Sistem (Admin) | `pages/admin/Settings.jsx` | ✅ |

### Ciri Yang Belum Dibina (Fasa 1+)

| Ciri | Status |
|---|---|
| Eksport laporan PDF (jsPDF) | ⬜ Belum dibina |
| Sistem amaran email (SMTP via Supabase Edge Functions) | ⬜ Belum dibina |
| KPI scoring automatik | ⬜ Belum dibina |
| Perbandingan tahun ke tahun (YoY) | ⬜ Belum dibina |
| Drill-down per projek (Project Detail screen) | ⬜ Belum dibina |

---

## Akaun Ujian

| Peranan | E-mel | Kata Laluan |
|---|---|---|
| CEO | `ceo@koperasi.my` | `Password123!` |
| Pengurus Projek | `pm@koperasi.my` | `Password123!` |
| Pengarah | `director@koperasi.my` | `Password123!` |
| Admin | `admin@koperasi.my` | `Password123!` |

---

## Pending Manual — Perlu Dibuat Oleh Engineer

| # | Perkara | Keutamaan |
|---|---|---|
| 1 | Buat Supabase Storage bucket `expense-receipts` (Private) | Sebelum demo |
| 2 | `pnpm add recharts` — untuk Papan Pemuka (Recharts) | Sebelum test Dashboard |
| 3 | `pnpm add xlsx` — untuk eksport Excel dalam Laporan | Sebelum test Reports |

---

## Langkah Seterusnya (Mengikut Keutamaan)

1. **Manual Setup oleh Iskandar** — buat storage bucket, jalankan `pnpm add recharts xlsx`
2. **UAT** — bagi CEO dan PM sebenar cuba sistem, kumpul feedback
3. **Deploy ke Supabase Cloud** — setup demo environment
4. **Eksport laporan PDF** (jsPDF) — tambah butang "Muat Turun PDF" di Reports
5. **Sistem amaran email** — SMTP via Supabase Edge Functions
