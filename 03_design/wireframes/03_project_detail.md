# Wireframe 03: Perincian Terperinci Projek (Project Detail Drill-Down)

**Fail Reka Bentuk:** `03_design/wireframes/03_project_detail.md`  
**Sasaran Pengguna:** CEO, Pengarah (Director), Pengurus Projek (PM - bagi projek yang ditugaskan sahaja)  
**Status Skrin:** Mandatori (Fasa 1 MVP - Drill-down Analytics)  

---

## 1. Susun Atur Wireframe (ASCII Layout Diagram)

### 1.1 Pandangan Desktop Perincian Projek (Project Detail Desktop View)

```text
+---------------------------------------------------------------------------------------------------+
| KOP-PUSAMAJU  [ Papan Pemuka ] [ Projek ] [ Laporan ] [ Tetapan ]    (👤 CEO Ahmad | 🔔 3 | Log Keluar) |
+---------------------------------------------------------------------------------------------------+
| <- Kembali ke Papan Pemuka | Projek > Perincian Projek                                            |
|                                                                                                   |
| PROJEK: [ 1. Ar-rahnu              [v] ] (Perkhidmatan Kewangan Islam)   [ Penapis: Julai 2026 v ] |
| Pengurus Projek: Ismail Bin Harun | Ditubuhkan: Jan 2024                 [ 📄 Eksport Projek ]    |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  +-----------------------+ +-----------------------+ +-----------------------+ +----------------+ |
|  | HASIL PROJEK (JUL)    | | PERBELANJAAN PROJEK   | | UNTUNG BERSIH PROJEK  | | PRESTASI PM    | |
|  | RM 400,000.00         | | RM 210,000.00         | | RM 190,000.00        | | Skor KPI Bulak | |
|  | Sasaran: RM 380,000   | | Bajet: RM 220,000     | | Margin Untung: 47.5% | | 🟢 94 / 100    | |
|  | Status: 🟢 +105.2%    | | Status: 🟢 Di Bawah   | | MoM: ▲ +8.2%         | | Cemerlang      | |
|  +-----------------------+ +-----------------------+ +-----------------------+ +----------------+ |
|                                                                                                   |
|  +----------------------------------------------------------------------------------------------+ |
|  | CARTA PRESTASI BULANAN 12 BULAN (Hasil Aktual vs Sasaran vs Perbelanjaan)                    | |
|  | (RM Ribu)                                                                                    | |
|  |  400k|                                     [■]                                               | |
|  |  350k|                         [■]         [■] (Line Sasaran: --------------------------)    | |
|  |  300k|             [■]         [■]   [■]   [■]                                               | |
|  |  250k|       [■]   [■]   [■]   [■]   [■]   [■] (Bar Belanja: [xxxx])                         | |
|  |      +-----------------------------------------                                              | |
|  |        Okt   Nov   Dis   Jan   Feb   Mac   Jul                                               | |
|  |       [■] Hasil Aktual    [xxxx] Perbelanjaan    --- Sasaran Hasil                           | |
|  +----------------------------------------------------------------------------------------------+ |
|                                                                                                   |
|  +----------------------------------------------------------------------------------------------+ |
|  | TAB: [ Hasil Terperinci ]  [* Perbelanjaan Terperinci *]  [ Rekod Jejak Audit (Audit Trail) ] | |
|  +----------------------------------------------------------------------------------------------+ |
|  | Carian Item: [____________]                                 [ Muat Turun Data (.csv) ]       | |
|  +----------------------------------------------------------------------------------------------+ |
|  | Tarikh     | Kategori Belanja     | Penerangan              | Jumlah (RM) | Resit  | Status  | |
|  +------------+----------------------+-------------------------+-------------+--------+---------+ |
|  | 25/07/2026 | Pembekal & Barangan  | Pembelian Emas Sandaran |  150,000.00 | [📄]   | 🟢 Lulus| |
|  | 18/07/2026 | Operasi Kedai        | Sewa Pejabat Cawangan   |   35,000.00 | [📄]   | 🟢 Lulus| |
|  | 12/07/2026 | Utiliti & Internet   | Bil Elektrik & Unifi    |    3,400.00 | [📄]   | 🟢 Lulus| |
|  | 05/07/2026 | Pemasaran            | Iklan Facebook Ads Jul  |    8,500.00 | [📄]   | 🟢 Lulus| |
|  | 01/07/2026 | Gaji & Upah          | Gaji 5 Kakitangan Caw   |   13,100.00 | [📄]   | 🟢 Lulus| |
|  +------------+----------------------+-------------------------+-------------+--------+---------+ |
|  | Jumlah Perbelanjaan Julai 2026                              |  210,000.00 |                  | |
|  +----------------------------------------------------------------------------------------------+ |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Pecahan Komponen UI (UI Component Breakdown)

1. **Navigasi Jejak (Breadcrumb Navigation) & Tajuk Halaman:**
   - Laluan: `Papan Pemuka > Perincian Projek`.
   - Butang kembali `<- Kembali ke Papan Pemuka` di bahagian atas kiri untuk memudahkan CEO menavigasi semula ke paparan global utama.

2. **Dropdown Pemilih Projek (Project Selector Dropdown):**
   - Elemen penukar projek pantas: Dropdown `[ 1. Ar-rahnu [v] ]` membolehkan CEO beralih dari satu projek ke projek yang lain secara langsung tanpa perlu kembali ke halaman utama.

3. **Maklumat Pengurus & Profil Projek (Project Info Header):**
   - Nama Pengurus Projek: Ismail Bin Harun (PM) - dengan pautan e-mel.
   - Maklumat industri ("Kewangan Islam") dan Tarikh Ditubuhkan.
   - Pilihan Eksport Projek: Menjana laporan PDF khusus untuk projek terpilih sahaja.

4. **4 Kad Ringkasan Projek (Project KPI Cards):**
   - **Hasil Projek (Julai):** RM 400,000.00 (Sasaran: RM 380,000) - Lencana peratusan `🟢 +105.2%`.
   - **Perbelanjaan Projek (Julai):** RM 210,000.00 (Bajet: RM 220,000) - Lencana `🟢 Di Bawah Bajet`.
   - **Untung Bersih Projek (Julai):** RM 190,000.00 (Margin Untung: 47.5%).
   - **Prestasi PM (Skor KPI):** `🟢 94 / 100` (Mengira prestasi penghantaran laporan tepat pada masa, margin keuntungan, dan pencapaian sasaran).

5. **Carta Trend Prestasi Projek (Project Performance Chart):**
   - Carta gabungan (Combo Chart): Bar menunjukkan Hasil Aktual (Navy) dan Perbelanjaan Aktual (Kelabu), dipadankan dengan Garis Sasaran Jualan (Garis Putus Emerald Green) dalam tempoh 12 bulan.

6. **Bahagian Kandungan Tab Pilihan (Tabbed Sub-Sections):**
   - **Tab 1: Hasil Terperinci (Detailed Revenue Table):** Memaparkan senarai semua transaksi kemasukan jualan (Jualan Biasa, Hasil Berulang, Bayaran Pendahuluan) berserta nama pelanggan dan jenis produk.
   - **Tab 2: Perbelanjaan Terperinci (Detailed Expense Table - Active):** Memaparkan senarai perbelanjaan, kategori belanja, ikon muat turun resit `[📄]`, dan status kelulusan.
   - **Tab 3: Rekod Jejak Audit (Audit Trail):** Memaparkan rekod log sistem ("Siapa buat, apa diubah, bila dilakukan") untuk memastikan integriti data.

---

## 3. Tingkah Laku UX & Interaksi (UX Behaviors & Interactions)

### 3.1 Pertukaran Projek Pantas (Project Switcher):
- Apabila dropdown projek ditukar, data pada halaman tersebut dikemas kini secara langsung menggunakan asynchronous request (React State/AJAX), mengelakkan pemuatan semula halaman penuh.

### 3.2 Interaksi Pertukaran Tab (Tab Switching UI):
- Mengklik tab (Hasil / Perbelanjaan / Audit Trail) akan bertukar paparan panel di bawahnya dengan animasi transisi memudar (fade-in) yang pantas.

### 3.3 Modal Pratonton Dokumen / Resit (Receipt PDF Preview Modal):
- Apabila ikon resit `[📄]` diklik pada jadual perbelanjaan, tetingkap modal (Overlay Modal Popup) akan dibuka di tengah-tengah skrin, memaparkan pratonton fail PDF atau imej resit/invois secara langsung (dengan butang "Muat Turun" dan "Tutup").

### 3.4 Hak Akses Dinamik (Access Control):
- Jika pengguna log masuk ialah Pengurus Projek (PM) Ismail Bin Harun, dropdown Projek akan dilumpuhkan (disabled) dan beliau hanya dibenarkan melihat projek **Ar-rahnu** sahaja. Butang eksport kewangan juga dihadkan mengikut kebenaran yang ditugaskan.
