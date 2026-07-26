# Tech Stack

**Ditulis oleh:** Engineer (Iskandar)  
**Dikemaskini:** 25 Julai 2026  
**Status:** 🔜 Dalam proses — sebahagian telah ditetapkan

---

## Stack Yang Ditetapkan

| Layer | Teknologi | Sebab Pemilihan |
|---|---|---|
| Frontend | React (JSX) | SPA, interaktif, ekosistem luas |
| Charts | Recharts | Built-in untuk React, mudah guna |
| Styling | Tailwind CSS | Utility-first, cepat develop |
| Backend & Database | **Supabase** | Lihat nota di bawah |
| Export Excel | SheetJS | Export .xlsx |
| Export PDF | jsPDF | Export PDF |
| Hosting | TBD oleh Engineer | — |
| Email Alert | TBD oleh Engineer | Supabase Edge Functions / SendGrid / SMTP |

---

## Supabase — Nota Teknikal

Supabase dipilih sebagai backend utama sistem ini. Ini adalah keputusan yang sesuai berdasarkan keperluan projek:

| Keperluan Projek | Sokongan Supabase |
|---|---|
| Database relational | ✅ PostgreSQL — kukuh dan scalable |
| Authentication (username/password) | ✅ Supabase Auth — built-in, selamat |
| Role-based access control | ✅ Row Level Security (RLS) — kawalan akses di peringkat database |
| API-ready | ✅ REST & GraphQL API auto-generated |
| Upload fail (resit/invois) | ✅ Supabase Storage — built-in file storage |
| Real-time dashboard | ✅ Supabase Realtime — data update tanpa refresh |
| Audit trail | ✅ Boleh dibina menggunakan PostgreSQL triggers |
| Bersedia untuk multi-tenancy | ✅ RLS memudahkan pengasingan data per tenant |
| Scalable | ✅ Boleh di-host sendiri (self-hosted) atau guna cloud |
| Email alert | ✅ Supabase Edge Functions boleh trigger email |

---

## Keputusan Tambahan

| Perkara | Keputusan | Catatan |
|---|---|---|
| **Email Alert** | SMTP | Murah, mudah setup, tidak bergantung kepada pihak ketiga |
| **Export PDF/Excel** | Client-side | Menggunakan jsPDF + SheetJS terus di browser |
| **Hosting (semasa)** | Local hosting | Fokus untuk development dan testing dahulu |
| **Hosting (masa depan)** | Supabase self-hosted | Bergantung kepada bajet CEO — akan migrate apabila confirmed |
| **Testing & Demo** | Supabase Cloud | Guna Supabase Cloud free tier untuk demo kepada CEO |
| **Frontend Deployment** | TBD | Ikut keputusan hosting — Vercel/Netlify untuk cloud, local serve untuk development |

---

## Strategi Deployment

```
Fasa Semasa (Development)
└── Local hosting
    ├── Supabase local (supabase start)
    └── React dev server (npm run dev)

Fasa Testing & Demo
└── Supabase Cloud (free tier)
    └── Frontend — Vercel / Netlify (free tier)

Fasa Production (Bergantung Bajet CEO)
├── Opsyen A — Supabase Cloud (managed, kos bulanan)
└── Opsyen B — Supabase self-hosted (VPS, kos lebih rendah jangka panjang)
```

> **Prinsip Utama:** Sistem mesti dibina supaya boleh berpindah antara local → cloud → self-hosted **tanpa perlu tulis semula kod**. Guna environment variables untuk semua konfigurasi.
