# Wireframe Specs — Konfigurasi Sasaran & KPI (Targets & KPI Configuration)

## 1. Gambaran Keseluruhan Skrin
Skrin ini digunakan oleh **CEO** dan **Super Admin** untuk menetapkan sasaran hasil bulanan (RM), margin untung minimum (%), dan mengkonfigurasi ambang petunjuk visual amaran (🟢/🟡/🔴) bagi setiap projek.

---

## 2. Lakaran Layout (ASCII Wireframe)

```
+-------------------------------------------------------------------------------------------------------+
| KOP-PUSAMAJU Command Centre  [Papan Pemuka] [Semak Perbelanjaan (2)] [Sasaran] [Laporan] | [CEO User] |
+-------------------------------------------------------------------------------------------------------+
|                                                                                                       |
| TETAPAN SASARAN & KPI PROJEK                                                                          |
| Urus sasaran jualan dan margin keuntungan bulanan di peringkat projek.                                |
|                                                                                                       |
| +---------------------------------------------------------------------------------------------------+ |
| | AMBANG AMARAN KPI (THRESHOLD SETTINGS)                                                            | |
| | Tentukan batas peratusan prestasi sasaran untuk petunjuk warna:                                   | |
| |                                                                                                   | |
| | 🟢 Hijau (Mencapai): >= [ 100 ] %   🟡 Kuning (Amaran): [ 80 ] % - 99%   🔴 Merah (Gagal): < 80%    | |
| |                                                                                 [ Simpan Ambang ] | |
| +---------------------------------------------------------------------------------------------------+ |
|                                                                                                       |
| JADUAL SASARAN BULANAN                                      [ Tahun: 2026 v ]   [ Bulan: Julai  v ]   |
| +---------------------------------------------------------------------------------------------------+ |
| | Nama Projek         | Sasaran Hasil (RM)  | Sasaran Margin (%)  | Terakhir Dikemaskini | Pilihan  | |
| +---------------------+---------------------+---------------------+----------------------+----------+ |
| | Ar-rahnu            | [ 450,000.00      ] | [ 50.00           ] | 2026-06-25 oleh CEO  | [Kemaskini]|
| | Pasaraya            | [ 400,000.00      ] | [ 15.00           ] | 2026-06-25 oleh CEO  | [Kemaskini]|
| | Freshmart           | [ 280,000.00      ] | [ 12.00           ] | 2026-06-25 oleh CEO  | [Kemaskini]|
| | Pembangunan Hartanah| [ 800,000.00      ] | [ 25.00           ] | 2026-06-25 oleh CEO  | [Kemaskini]|
| | Pembiayaan Peribadi | [ 200,000.00      ] | [ 60.00           ] | 2026-06-25 oleh CEO  | [Kemaskini]|
| | ...                 | ...                 | ...                 | ...                  | ...      | |
| +---------------------------------------------------------------------------------------------------+ |
|                                                                                [ KEMASIKINI SEMUA ]   |
|                                                                                                       |
+-------------------------------------------------------------------------------------------------------+
```

---

## 3. Komponen UI & Fungsi

| # | Komponen | Jenis | Teks / Label (BM) | Fungsi / Tingkah Laku |
|---|---|---|---|---|
| 1 | Ambang KPI | Input Numbers | Green / Yellow / Red | Menetapkan julat peratusan pencapaian target. Disimpan ke `system_settings`. |
| 2 | Penapis Tahun | Dropdown | Tahun | Memilih tahun sasaran (cth: 2026) |
| 3 | Penapis Bulan | Dropdown | Bulan | Memilih bulan sasaran (cth: Julai) |
| 4 | Input Sasaran Hasil | Numeric Input | Sasaran Hasil (RM) | Menetapkan nilai minimum hasil projek bagi bulan tersebut |
| 5 | Input Margin | Percentage Input| Sasaran Margin (%) | Menetapkan sasaran peratusan keuntungan bersih |
| 6 | Butang Kemaskini | Inline Link | Kemaskini | Menyimpan sasaran satu baris projek sahaja |
| 7 | Butang Kemaskini Semua| Primary Button | KEMASKINI SEMUA | Menyimpan semua baris sasaran yang diedit dalam jadual sekaligus |

---

## 4. Alur Pengguna (User Flow)
1. CEO pergi ke halaman `/targets-config` (Sasaran).
2. Sistem mengambil data dari `project_targets` untuk `Year = 2026` dan `Month = 7` (Julai).
3. RLS memastikan hanya CEO atau Super Admin yang mempunyai hak penulisan.
4. CEO menukar target Ar-rahnu dari RM450,000 ke RM500,000 dan menekan **KEMASKINI SEMUA**.
5. Client menghantar permintaan `POST /project_targets` (menggunakan query upsert untuk menggantikan rekod sedia ada).
6. Dashboard CEO dikemas kini dengan serta-merta untuk memaparkan petunjuk visual prestasi yang dikira berdasarkan sasaran baharu.
