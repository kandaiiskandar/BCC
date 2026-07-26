# Development Test Login Accounts

This document records the pre-configured local test login credentials available after running `supabase start` or `supabase db reset`.

---

## 1. Test Login Credentials Table

| Role | E-mel Log Masuk | Kata Laluan (Default) | Nama Pengguna | Projek Ditugaskan |
|---|---|---|---|---|
| **CEO** | `ceo@koperasi.my` | `Password123!` | Ahmad Fauzi (CEO) | Semua Projek (Akses Penuh + Kelulusan) |
| **Pengurus Projek (PM)** | `pm@koperasi.my` | `Password123!` | Siti Sarah (Pengurus Projek) | Ar-rahnu & Freshmart |
| **Director / Management** | `director@koperasi.my` | `Password123!` | Rohani Ali (Pengarah) | Semua Projek (Lihat Sahaja) |
| **Admin** | `admin@koperasi.my` | `Password123!` | Khairul (Admin Sistem) | Urus Pengguna & Tetapan Sistem |

---

## 2. Dynamic Redirection Matrix

When logging in, the system automatically redirects the user based on their assigned role:

| Peranan | Halaman Utama Default (Redirect) | Keizinan Akses Utama |
|---|---|---|
| **CEO / Super Admin** | `/dashboard` | Papan Pemuka Eksekutif, Kelulusan Perbelanjaan, Sasaran & KPI, Laporan |
| **Director** | `/dashboard` | Papan Pemuka Eksekutif (Lihat Sahaja), Laporan |
| **Project Manager** | `/sales-entry` | Rekod Jualan Bulanan, Rekod Perbelanjaan (Hanya projek yang ditugaskan) |
| **Admin** | `/users` | Pengurusan Pengguna, Tetapan Sistem |

---

## 3. How to Reset Test Accounts
If test data or user profiles become out of sync during testing, run the following command in your terminal to re-apply migrations and seed accounts:

```bash
cd 04_development
supabase db reset
```
