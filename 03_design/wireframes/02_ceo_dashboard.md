# Wireframe 02: Papan Pemuka Eksekutif CEO (CEO Executive Dashboard)

**Fail Reka Bentuk:** `03_design/wireframes/02_ceo_dashboard.md`  
**Sasaran Pengguna:** CEO, Pengarah (Director), Super Admin  
**Status Skrin:** Mandatori (Fasa 1 MVP - Central Command Centre)  

---

## 1. Susun Atur Wireframe (ASCII Layout Diagram)

### 1.1 Pandangan Desktop Penuh (Desktop Command Centre Layout)

```text
+---------------------------------------------------------------------------------------------------+
| KOP-PUSAMAJU  [ Papan Pemuka ] [ Projek ] [ Laporan ] [ Tetapan ]    (👤 CEO Ahmad | 🔔 3 | Log Keluar)|
+---------------------------------------------------------------------------------------------------+
| AMPAUAN UTAMA / PAPAN PEMUKA CEO                                 [ Penapis: Bulan Ini (Julai 2026) v ] |
| Koperasi Pembangunan Usahasama Masyarakat Maju Sabah Berhad        [ 📄 Eksport PDF ] [ 📊 Excel ] |
+---------------------------------------------------------------------------------------------------+
| ⚠️ AMARAN SISTEM: 2 tuntutan perbelanjaan menunggu kelulusan anda. [ Lihat & Luluskan Sekarang ]  |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  +-----------------------+ +-----------------------+ +-----------------------+ +----------------+ |
|  | JUMLAH HASIL (JUL)    | | JUMLAH PERBELANJAAN   | | UNTUNG BERSIH (JUL)   | | SASARAN PROJEK | |
|  | RM 1,245,800.00       | | RM 782,400.00         | | RM 463,400.00        | | 8 / 10 Achieved| |
|  | ▲ +12.4% vs bln lepas | | ▼ -3.1% vs bln lepas | | ▲ +18.2% margin 37% | | 🟢 80% Mencapai| |
|  | [==============  ]    | | [==========        ] | | [================= ] | | [========    ] | |
|  +-----------------------+ +-----------------------+ +-----------------------+ +----------------+ |
|                                                                                                   |
|  +----------------------------------------------------+ +-----------------------------------------+ |
|  | CARTA TREND HASIL BULANAN (12 BULAN TERKINI)       | | PECAHAN HASIL MENGIKUT PROJEK (%)       | |
|  | (RM Juta)                                          | |                                         | |
|  | 1.5M|             [■]                              | |    /-------\    ■ Ar-rahnu (32%)        | |
|  | 1.2M|         [■] [■]     [■]                      | |   /  (32%)  \   ■ Pasaraya (24%)        | |
|  | 0.9M| [■] [■] [■] [■] [■] [■]                      | |  |  Ar-rahnu |  ■ Freshmart (15%)        | |
|  | 0.6M| [■] [■] [■] [■] [■] [■]                      | |   \ (24%)   /   ■ Hartanah (14%)         | |
|  |     +--------------------------------              | |    \-------/    ■ Lain-lain (15%)       | |
|  |       Okt Nov Dis Jan Feb Mac ... Jul              | |                                         | |
|  |  ■ Hasil Aktual   --- Sasaran Bulanan              | | Jumlah: RM 1,245,800.00                 | |
|  +----------------------------------------------------+ +-----------------------------------------+ |
|                                                                                                   |
|  +----------------------------------------------------------------------------------------------+ |
|  | RINGKASAN PRESTASI 10 PROJEK AKTIF                                 [ Cari Projek: [________] ]| |
|  +----------------------------------------------------------------------------------------------+ |
|  | Nama Projek        | Industri       | Hasil (RM)  | Belanja (RM)| Untung (RM) | % Target | Status| |
|  +--------------------+----------------+-------------+-------------+-------------+----------+-------+ |
|  | 1. Ar-rahnu        | Kewangan Islam |  400,000.00 |  210,000.00 |  190,000.00 |   105.2% | 🟢    | |
|  | 2. Pasaraya        | Runcit         |  300,000.00 |  230,000.00 |   70,000.00 |    98.5% | 🟡    | |
|  | 3. Freshmart       | Runcit / Segar |  185,000.00 |  140,000.00 |   45,000.00 |   102.8% | 🟢    | |
|  | 4. Hartanah        | Pembinaan      |  175,000.00 |   95,000.00 |   80,000.00 |    87.5% | 🟡    | |
|  | 5. Pembiayaan      | Kewangan       |  110,000.00 |   60,000.00 |   50,000.00 |   110.0% | 🟢    | |
|  | 6. Hardware        | Bahan Binaan   |   45,000.00 |   30,000.00 |   15,000.00 |    75.0% | 🔴    | |
|  | 7. PCS Container   | Infrastruktur  |   30,000.00 |   17,400.00 |   12,600.00 |    60.0% | 🔴    | |
|  | 8. Pembekal Runcit | Pembekalan     |   75,000.00 |   45,000.00 |   30,000.00 |   100.0% | 🟢    | |
|  | 9. Insurans        | Insurans       |   40,000.00 |   25,000.00 |   15,000.00 |   100.0% | 🟢    | |
|  | 10. Pelancongan    | Pelancongan    |   85,000.00 |   60,000.00 |   25,000.00 |   106.3% | 🟢    | |
|  +--------------------+----------------+-------------+-------------+-------------+----------+-------+ |
|  | Memaparkan 1-10 daripada 10 projek                   [ Klik pada projek untuk perincian lanjut ]| |
|  +----------------------------------------------------------------------------------------------+ |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Pecahan Komponen UI (UI Component Breakdown)

1. **Bilah Navigasi Atas & Pengepala Global (Topbar Header):**
   - Logo Kop-Pusamaju + Tajuk "Papan Pemuka".
   - Pautan Navigasi: Papan Pemuka (Active), Projek, Laporan, Tetapan Sistem.
   - Profil Pengguna (Nama & Peranan e-mel), Ikon Notifikasi 🔔 (dengan badge angka amaran belum dibaca), dan Butang Log Keluar.

2. **Jalur Penapis Tarikh & Tindakan Eksport (Filter & Export Action Bar):**
   - **Dropdown Penapis Tarikh (Date Filter Switcher):** Membolehkan CEO menukar tempoh paparan:
     - *Bulan Semasa (Julai 2026)* - Default
     - *Bulan Lepas (Jun 2026)*
     - *3 Bulan Terkini (Q2/Q3)*
     - *Tahun Semasa (Year-to-Date / YTD)*
     - *Tahun Ke Tahun (YoY Comparison)*
   - **Butang Eksport Laporan:** Butang "📄 Eksport PDF" dan "📊 Excel" di bahagian kanan untuk menjana laporan eksekutif serta-merta.

3. **Spanduk Amaran Tindakan Segera (Urgent Alert Banner):**
   - Jalur amaran berwarna kuning/kuning keemasan (`#fef9c3`) di bahagian atas apabila terdapat perbelanjaan yang memerlukan kelulusan CEO atau projek yang belum menghantar data laporan.
   - Pautan tindakan langsung: `[ Lihat & Luluskan Sekarang ]`.

4. **4 Kad KPI Utama (Top Metric KPI Cards):**
   - **Kad 1: Jumlah Hasil Bulanan:** Nilai Ringgit Malaysia (RM 1,245,800.00) bersaiz 28px bold. Trend peratusan berbanding bulan lepas (▲ +12.4%).
   - **Kad 2: Jumlah Perbelanjaan Bulanan:** Nilai RM (RM 782,400.00). Peratusan perubahan perbelanjaan (▼ -3.1%).
   - **Kad 3: Keuntungan Bersih Bulanan:** Keuntungan bersih (RM 463,400.00) dengan margin keuntungan (%) terpapar.
   - **Kad 4: Status Pencapaian Sasaran Projek:** Bilangan projek mencapai sasaran (8/10 Projek Achieved) dengan penunjuk visual peratusan (80%).

5. **Petak Carta Visual (Visual Charts Grid):**
   - **Carta Trend Hasil Bulanan (Bar/Line Chart):** Memaparkan trend 12 bulan jualan aktual berbanding sasaran yang ditetapkan. Lakaran bar menggunakan warna Navy (`#1e293b`) dan garisan sasaran Emerald Green (`#10b981`).
   - **Carta Pecahan Hasil (Donut/Pie Chart):** Pecahan peratusan jualan mengikut projek. Membantu CEO mengenal pasti projek yang menjadi penyumbang utama pendapatan koperasi.

6. **Jadual Ringkasan 10 Projek Aktif (Project Summary Table):**
   - Memaparkan kesemua 10 projek (Ar-rahnu, Pasaraya, Freshmart, Hartanah, Pembiayaan, Hardware, PCS Container, Pembekal Runcit, Insurans, Pelancongan).
   - Lajur: Nama Projek, Industri, Jumlah Hasil (RM), Perbelanjaan (RM), Untung/Rugi (RM), % Pencapaian Sasaran, dan Status Badge Visual (🟢 ≥100%, 🟡 80%-99%, 🔴 <80%).
   - Menyokong penyusunan lajur (column sorting) dan carian dinamik.

---

## 3. Tingkah Laku UX & Interaksi (UX Behaviors & Interactions)

### 3.1 Interaksi Latih Tubi (Drill-Down Row Click):
- Apabila CEO mengklik mana-mana baris projek dalam jadual (contohnya mengklik baris "1. Ar-rahnu"), sistem akan membuka **Halaman Perincian Projek (03_project_detail.md)** bagi projek berkenaan secara automatik.

### 3.2 Pertukaran Julat Tarikh (Date Range Filtering):
- Memilih julat tarikh baharu daripada dropdown penapis tarikh akan memuat semula semua data 4 kad KPI, carta visual, dan jadual ringkasan tanpa perlu memuat semula (refresh) keseluruhan halaman (Single Page Application / AJAX state reload).

### 3.3 Kelulusan Pantas Perbelanjaan (Quick Approval Action):
- Mengklik pautan pada Spanduk Amaran akan membuka tetingkap **Modal Kelulusan Perbelanjaan (Expense Approval Drawer)**. CEO boleh melihat maklumat ringkas resit dan membuat kelulusan (Approve) atau penolakan (Reject) secara terus tanpa keluar dari Papan Pemuka.

### 3.4 Eksport Laporan Lanjutan:
- Mengklik "📄 Eksport PDF" akan menjana dokumen PDF bertaraf eksekutif yang mengandungi grafik kad KPI dan jadual ringkasan sedia untuk pembentangan Ahli Lembaga Pengarah Koperasi.
