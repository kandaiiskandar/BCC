# Style Guide & Design System — Fasa 03

**Projek:** Sistem Dashboard Jualan (Business Command Centre)  
**Koperasi Pilot:** Koperasi Pembangunan Usahasama Masyarakat Maju Sabah Berhad (Kop-Pusamaju)  
**Prinsip Reka Bentuk:** SaaS White-Label Ready, Multi-Tenant Architecture Ready, Accessible, Responsive, Corporate Professional.  
**Tarikh:** 26 Julai 2026  
**Versi:** 1.0  

---

## 1. Visi Identiti & Prinsip Reka Bentuk Visual

Sistem Dashboard Jualan Kop-Pusamaju direka sebagai sebuah **Business Command Centre** — pusat kawalan perniagaan berpusat yang memberikan eksekutif atasan visibiliti menyeluruh dan pantas.

### Prinsip Utama:
1. **Kejelasan Eksekutif (Executive Clarity):** Mengurangkan beban kognitif pengguna melalui susun atur hierarki maklumat yang tersusun, KPI bersaiz besar, dan skema warna yang berkesan.
2. **Kop-Pusamaju Brand Identity (Corporate Navy & Emerald Green):** Menggabungkan ketegasan korporat (*Corporate Navy*) dengan identiti pertumbuhan dan kejayaan koperasi (*Emerald Green*).
3. **White-Label & Multi-Tenant Ready:** Pemisahan pembolehubah warna tema (CSS CSS Variables/Design Tokens) supaya sistem bersedia dinyah-pasang atau ditukar jenama untuk koperasi lain pada Fasa SaaS kelak.
4. **Bahasa Malaysia UI Standards:** Penggunaan Bahasa Malaysia yang profesional, padat, dan piawai untuk semua elemen teks antaramuka (UI labels, headers, status messages, dan notifikasi).

---

## 2. Palet Warna (Color Palette & Tokens)

Sistem warna dibina di atas pembolehubah CSS (Design Tokens) dengan kontras yang tinggi untuk memastikan tahap kebolehbacaan (accessibility - WCAG AA compliant).

### 2.1 Warna Utama (Primary Brand Colors)
*Digunakan untuk navigasi utama, bilah sisi (sidebar), pengepala (headers), dan elemen tindakan utama.*

| Warna | CSS Token | Hex Code | Penggunaan Utama |
|---|---|---|---|
| **Corporate Navy (Dark)** | `--color-navy-900` | `#0f172a` | Latar belakang Sidebar, Topbar Dark, Teks Pengepala Utama |
| **Corporate Navy (Base)** | `--color-navy-800` | `#1e293b` | Pengepala Kad, Modul Navigasi Utama, Punang Butang Utang |
| **Corporate Navy (Light)** | `--color-navy-700` | `#334155` | Border Kelabu Navy, Sub-header, Icon aktif |

### 2.2 Warna Sekunder & Aksen (Secondary / Brand Accent)
*Identiti visual khas Kop-Pusamaju untuk menyerlahkan kejayaan, sasaran, dan tindakan positif.*

| Warna | CSS Token | Hex Code | Penggunaan Utama |
|---|---|---|---|
| **Emerald Green (Dark)** | `--color-emerald-700` | `#059669` | Hover state butang hijau, Teks Aksen Sasaran Achieved |
| **Emerald Green (Base)** | `--color-emerald-600` | `#10b981` | Butang Tindakan Utama, Lencana Cemerlang, Indicator |
| **Emerald Green (Light)** | `--color-emerald-400` | `#34d399` | Highlight grafik, Carta bar jualan puncak, Border aksen |

### 2.3 Warna Neutral & Kelabu (Slate Grays)
*Digunakan untuk latar belakang halaman, kad antaramuka, garisan pemisah, dan perenggan teks.*

| Warna | CSS Token | Hex Code | Penggunaan Utama |
|---|---|---|---|
| **Canvas Background** | `--color-slate-50` | `#f8fafc` | Latar belakang keseluruhan aplikasi |
| **Card Surface** | `--color-slate-0` | `#ffffff` | Latar belakang Kad KPI, Jadual Data, Modals |
| **Border Soft** | `--color-slate-200` | `#e2e8f0` | Sempadan kad, garisan pemisah jadual (table borders) |
| **Text Primary** | `--color-slate-900` | `#0f172a` | Tajuk utama, nilai numerik KPI |
| **Text Secondary** | `--color-slate-500` | `#64748b` | Sub-tajuk, label input, teks pembantu (helper text) |

### 2.4 Warna Status & Penunjuk KPI (Status Indicators)
*Digunakan secara konsisten merentasi sistem untuk status kelulusan, penunjuk prestasi KPI, dan amaran.*

| Status | Code | Hex | Latar Belakang (Bg) | Border | Definisi / Penggunaan |
|---|---|---|---|---|---|
| 🟢 **Hijau (Success / Achieved)** | `--color-status-green` | `#22c55e` | `#dcfce7` (Green-100) | `#86efac` | Achieved target (≥100%), Status **Diluluskan** |
| 🟡 **Kuning (Warning / Moderate)** | `--color-status-yellow` | `#eab308` | `#fef9c3` (Yellow-100) | `#fde047` | Warning target (80%–99%), Status **Menunggu Kelulusan** |
| 🔴 **Merah (Danger / Critical)** | `--color-status-red` | `#ef4444` | `#fee2e2` (Red-100) | `#fca5a5` | Critical alert (<80%), Status **Ditolak** |
| 🔵 **Biru (Info / Neutral)** | `--color-status-blue` | `#3b82f6` | `#dbeafe` (Blue-100) | `#93c5fd` | Maklumat draf, Notifikasi sistem umum |

---

## 3. Tipografi (Typography Hierarchy)

Sistem menggunakan himpunan fon sans-serif moden **Inter** (fallback: system-ui, -apple-system, sans-serif) yang mempunyai kejelasan membaca yang sangat tinggi untuk data berangka dan jadual.

### 3.1 Skala Hirarki Fon

| Tahap / Role | Saiz (px / rem) | Font Weight | Line Height | Letter Spacing | Penggunaan |
|---|---|---|---|---|---|
| **Display Title** | 32px / 2.0rem | Bold (700) | 1.2 | -0.02em | Jumlah Angka Besar KPI Utama |
| **Heading 1 (H1)** | 24px / 1.5rem | Bold (700) | 1.3 | -0.01em | Tajuk Halaman Utama (e.g. Dashboard Executive) |
| **Heading 2 (H2)** | 20px / 1.25rem | Semi-Bold (600) | 1.35 | 0em | Tajuk Seksyen Kad, Tajuk Carta |
| **Heading 3 (H3)** | 18px / 1.125rem | Semi-Bold (600) | 1.4 | 0em | Tajuk Modal, Sub-seksyen |
| **Subtitle / Lead** | 16px / 1.0rem | Medium (500) | 1.5 | 0em | Penerangan ringkas, Tajuk lajur jadual |
| **Body Base** | 14px / 0.875rem | Regular (400) | 1.5 | 0em | Teks biasa, label input form, data jadual |
| **Caption / Small** | 12px / 0.75rem | Medium (500) | 1.4 | 0.01em | Teks bantuan, timestamp audit trail |
| **Micro Tag** | 10px / 0.625rem | Bold (700) | 1.2 | 0.05em | Lencana status berpiksel kecil, Tag kategori |

---

## 4. Spesifikasi Komponen UI (Component Specifications)

### 4.1 Butang (Buttons)
*Butang dibina dengan 4 variasi warna, 3 saiz piawai, serta status aktif/lumpuh (disabled) dan pemuatan (loading).*

#### Variasi Butang:
1. **Primary Button (Utama):** Latar belakang `--color-navy-800` (atau Emerald Green `#10b981` untuk simpan/hantar utama), Teks Putih `#ffffff`. Used for primary page actions (e.g. "Log Masuk", "Hantar Jualan").
2. **Secondary Button (Sekunder):** Latar belakang `#ffffff`, Border `--color-slate-200`, Teks `--color-slate-700`. Used for secondary actions (e.g. "Batal", "Simpan Draf").
3. **Success Button (Kelulusan):** Latar belakang `#22c55e`, Teks Putih. Used by CEO for "Luluskan Perbelanjaan".
4. **Destructive / Danger Button (Tolak/Padam):** Latar belakang `#ef4444`, Teks Putih. Used for "Tolak Perbelanjaan" or "Padam Rekod".
5. **Ghost / Link Button:** Latar belakang Transparent, Teks `--color-navy-800` / `--color-emerald-700`. Used for row actions like "Lihat Perincian ->".

#### Saiz Butang:
- **Kecil (Small):** Height 32px, Padding `6px 12px`, Font 12px. (Used in table rows).
- **Sederhana (Medium - Default):** Height 40px, Padding `10px 16px`, Font 14px. (Used in forms & action bars).
- **Besar (Large):** Height 48px, Padding `12px 24px`, Font 16px. (Used in Login screen & main modals).

#### States:
- **Hover:** Darken background by 10%, smooth transition 150ms.
- **Focus:** Outer ring 3px glow with `--color-emerald-400`.
- **Disabled:** Background `#e2e8f0`, Text `#94a3b8`, Cursor `not-allowed`.
- **Loading:** Text hidden or replaced with spinner animation icon + "Sedang Memproses...".

---

### 4.2 Medan Input & Borang (Inputs & Form Controls)

#### Spesifikasi Input Teks & Dropdown:
- **Tinggi Standards:** 40px (Medium).
- **Radius Sempadan:** 6px (`rounded-md`).
- **Gaya Default:** Latar Putih `#ffffff`, Sempadan `#cbd5e1`, Teks `#0f172a`.
- **Gaya Focus:** Sempadan `#10b981` (Emerald), Shadow Ring `0 0 0 3px rgba(16, 185, 129, 0.2)`.
- **Gaya Ralat (Error State):** Sempadan `#ef4444`, Text Ralat `#dc2626` bersaiz 12px di bawah medan input.

#### Medan Input Khusus:
1. **Medan Ringgit Malaysia (RM Input):**
   - Imbuhan awalan (Prefix) "RM" kekal terpapar di sebelah kiri medan dengan latar belakang `#f1f5f9`.
   - Pemformatan nombor automatik dengan koma pemisah ribuan (contoh: `RM 150,000.00`) dan penjajaran teks ke kanan.
2. **Pemilih Tarikh (Datepicker):**
   - Ikon kalendar di bahagian kanan Medan. Pemformatan standard: `DD/MM/YYYY` (cth: `26/07/2026`).
3. **Muat Naik Fail Resit (Drag & Drop Receipt Uploader):**
   - Kawasan zon gugur (dropzone) bersempadan putus-putus (`border-dashed 2px #cbd5e1`).
   - Menerima format fail: `.png`, `.jpg`, `.jpeg`, `.pdf` (Maksimum saiz: 5MB).
   - Menunjukkan penunjuk kemajuan (progress bar) muat naik fail dan pratonton (thumbnail) fail selepas muat naik.

---

### 4.3 Kad KPI & Kontena Data (Cards & Containers)

#### Kad KPI Ringkasan (Executive Summary Cards):
- **Saiz & Padding:** Padding 20px (`p-5`), Latar Putih `#ffffff`, Shadow halus (`shadow-sm`), Sempadan `#e2e8f0`, Radius 8px (`rounded-lg`).
- **Elemen Dalaman:**
  - Label Sub-title (12px Uppercase `#64748b` e.g. "JUMLAH HASIL BULAN INI")
  - Nilai Angka Utama (28px Bold `#0f172a` e.g. "RM 1,245,800.00")
  - Penunjuk Perubahan YoY / MoM (Lencana peratusan + Ikon Arrow Up/Down e.g. `▲ +12.4% vs bulan lepas`)
  - Jalur Kemajuan Sasaran (Progress bar 6px di bahagian bawah kad dengan warna mengikut status 🟢/🟡/🔴).

---

### 4.4 Lencana & Tag Status (Badges & Status Pills)

#### Lencana Status Kelulusan (Workflow Badges):
- **Menunggu Kelulusan:** Latar `#fef9c3`, Teks `#854d0e`, Border `#fde047` — Ikon ⏳.
- **Diluluskan:** Latar `#dcfce7`, Teks `#166534`, Border `#86efac` — Ikon ✅.
- **Ditolak:** Latar `#fee2e2`, Teks `#991b1b`, Border `#fca5a5` — Ikon ❌.

#### Lencana Status Prestasi KPI:
- **Cemerlang (≥100% Target):** Pill Hijau `🟢 Cemerlang (105%)`.
- **Sederhana (80%–99% Target):** Pill Kuning `🟡 Amaran (88%)`.
- **Perhatian (<80% Target):** Pill Merah `🔴 Perhatian (64%)`.

---

### 4.5 Tetingkap Modal & Dialog (Modals & Dialog Windows)

- **Backdrop Overlay:** `rgba(15, 23, 42, 0.6)` dengan kesan blur halus (`backdrop-blur-sm`).
- **Modal Box:** Width 600px (Medium Modal) / 800px (Large Modal / Receipt Viewer), Centered, Radius 12px, Shadow `shadow-xl`.
- **Header:** Tajuk Modal (H3 18px Bold), Butang Tutup (X) di penjuru kanan atas.
- **Content:** Kawasan skrol jika kandungan melebihi ketinggian tetingkap (max-height 70vh).
- **Footer Action Bar:** Bar melekat di bawah (Sticky footer) mengandungi butang tindakan utama (contoh: "Sahkan Kelulusan" / "Batal").

---

### 4.6 Jadual Data (Data Tables)

- **Header Jadual (Thead):** Latar `#f1f5f9`, Teks `--color-slate-700` (12px Bold Uppercase), Sticky top semasa skrol.
- **Baris Jadual (Trow):** Ketinggian 48px, Garisan pemisah halus `#f1f5f9`, Kesan hover `#f8fafc`.
- **Penjajaran Sel (Alignment):**
  - Teks / Nama Projek / Kategori: **Kiri (Left)**
  - Tarikh / Status Badge: **Tengah (Center)**
  - Nilai Kewangan (RM) / Peratusan (%): **Kanan (Right)** dengan fon monospace/tabular numerals.
- **Pagination & Action Row:** Bar navigasi halaman di bawah jadual mengandungi penunjuk "Memaparkan 1-10 daripada 10 projek" dan butang muka surat.

---

### 4.7 Tema & Skema Warna Carta (Chart Themes)

Digunakan untuk perpustakaan carta (Recharts / Chart.js):

- **Carta Bar (Monthly Sales Trend Bar Chart):**
  - Bar Hasil: `--color-navy-800` (`#1e293b`) dengan hover state `--color-navy-700` (`#334155`).
  - Bar Sasaran (Target line / bar overlay): `--color-emerald-500` (`#10b981`).
- **Carta Pai / Donut (Revenue Share by Project):**
  - Projek 1 (Ar-rahnu): `#0f172a` (Navy Dark)
  - Projek 2 (Pasaraya): `#10b981` (Emerald Base)
  - Projek 3 (Freshmart): `#0284c7` (Sky Blue)
  - Projek 4 (Pembangunan Hartanah): `#f59e0b` (Amber)
  - Projek 5 (Pembiayaan Peribadi): `#8b5cf6` (Purple)
  - Projek 6-10 (Lain-lain): `#64748b`, `#ec4899`, `#14b8a6`, `#f97316`, `#84cc16`.
- **Carta Garis (Growth Line Chart):**
  - Garis Hasil Aktual: Emerald `#10b981` (Tebal 3px).
  - Garis Sasaran: Navy `#64748b` (Garisan Putus-putus 2px).
- **Tooltip Carta:** Latar `#0f172a` (Navy 900) dengan teks putih `#ffffff`, menunjukkan nilai RM berformat penuh.

---

## 5. Glosari Terminology & Text Labels (Bahasa Malaysia UI Standard)

| Bahasa Inggeris | Bahasa Malaysia (UI Label Standard) | Penggunaan |
|---|---|---|
| Dashboard / Overview | **Papan Pemuka / Gambaran Keseluruhan** | Tajuk utama CEO Dashboard |
| Revenue / Sales | **Hasil / Jualan** | Label kewangan masuk |
| Expenses | **Perbelanjaan / Kos** | Label kewangan keluar |
| Net Profit / Loss | **Keuntungan / Kerugian Bersih** | Metrik keutamaan kewangan |
| Target vs Actual | **Sasaran vs Aktual** | Penunjuk KPI projek |
| Project Manager | **Pengurus Projek** | Peranan pengguna PM |
| Status: Pending | **Menunggu Kelulusan** | Workflow status perbelanjaan |
| Status: Approved | **Diluluskan** | Workflow status perbelanjaan |
| Status: Rejected | **Ditolak** | Workflow status perbelanjaan |
| Category | **Kategori Perbelanjaan / Jenis Hasil** | Borang entry & jadual |
| Date Range Filter | **Penapis Tarikh** | Dropdown julat tarikh |
| Attachment / Receipt | **Dokumen Sokongan / Resit** | Borang perbelanjaan |
| Submit / Save | **Hantar / Simpan Draf** | Butang borang |
| Approve / Reject | **Luluskan / Tolak** | Action drawer CEO |
| Export Report | **Eksport Laporan (PDF / Excel)** | Action header |
