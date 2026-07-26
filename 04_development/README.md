# 04 — Development

Semua yang berkaitan dengan pembangunan teknikal sistem Dashboard Jualan Kop-Pusamaju.

**Engineer:** Iskandar  
**PM:** —  
**Fasa Semasa:** Fasa 1 — MVP (Dalam Pembangunan)

---

## Panduan Pembangunan Pantas (Quick Start)

```bash
# 1. Jalankan pengkalan data tempatan (dalam folder 04_development/)
supabase start

# 2. Jalankan React Dev Server
pnpm dev

# 3. Bina fail pengeluaran (Production Build)
pnpm run build
```

*Akaun Ujian:* Rujuk `docs/test-accounts.md` untuk senarai e-mel dan kata laluan ujian.

---

## Struktur Folder

```
04_development/
│
├── specs/                        # Spesifikasi teknikal untuk engineer
│   ├── technical-spec.md         # Spesifikasi teknikal penuh (✅ Selesai)
│   ├── data-model.md             # Struktur database, RLS & triggers (✅ Selesai)
│   └── api-spec.md               # Spesifikasi API & RPC endpoints (✅ Selesai)
│
├── docs/                         # Dokumentasi teknikal semasa development
│   ├── architecture.md           # Keputusan seni bina sistem (✅ Selesai)
│   ├── tech-stack.md             # Stack teknologi & sebab pemilihan (✅ Selesai)
│   ├── test-accounts.md          # Senarai akaun ujian log masuk (✅ Selesai)
│   └── dev-notes.md              # Nota engineer & status pembangunan (✅ Selesai)
│
├── supabase/                     # Konfigurasi Supabase backend
│   ├── migrations/               # Fail migrasi skema SQL
│   └── seed.sql                  # Data benih ujian (Tenants, Projects, Auth Users)
│
├── src/                          # Source code React (Vite + Tailwind CSS)
│   ├── components/               # Komponen UI & Layout (MainLayout, ProtectedRoute)
│   ├── context/                  # AuthContext (Sesi & Peranan)
│   ├── hooks/                    # Custom hooks (useProjects, useSales)
│   ├── pages/                    # Halaman sistem (Login, SalesEntry)
│   ├── services/                 # supabaseClient integration
│   └── utils/                    # Formatters (formatRM, formatDateBM)
│
└── README.md                     # Fail ini
```

---

## Status Fail

| Fail / Modul | Status |
|---|---|
| `specs/technical-spec.md` | ✅ Selesai |
| `specs/data-model.md` | ✅ Selesai |
| `specs/api-spec.md` | ✅ Selesai |
| `docs/architecture.md` | ✅ Selesai |
| `docs/tech-stack.md` | ✅ Selesai |
| `docs/test-accounts.md` | ✅ Selesai |
| `docs/dev-notes.md` | ✅ Selesai |
| `supabase/` (Migrations & Seed) | ✅ Selesai & Berfungsi |
| `src/pages/auth/Login.jsx` | ✅ Selesai & Berfungsi |
| `src/pages/pm/SalesEntry.jsx` | ✅ Selesai & Berfungsi |
| `src/pages/pm/ExpenseEntry.jsx` | 🔜 Tugasan Seterusnya (Option C) |
| `src/pages/ceo/Dashboard.jsx` | 🔜 Tugasan Seterusnya (Option D) |
| `src/pages/admin/UserManagement.jsx` | 🔜 Tugasan Seterusnya (Option E) |
