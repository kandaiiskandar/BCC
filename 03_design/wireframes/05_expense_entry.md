# Wireframe 05: Skrin Kemasukan & Kelulusan Perbelanjaan (Expense Entry & Approval Screen)

**Fail Reka Bentuk:** `03_design/wireframes/05_expense_entry.md`  
**Sasaran Pengguna:** Pengurus Projek (PM - borang tuntutan), CEO (alir kerja kelulusan)  
**Status Skrin:** Mandatori (Fasa 1 MVP - Expense Approval Workflow)  

---

## 1. Susun Atur Wireframe (ASCII Layout Diagram)

### 1.1 Pandangan PM: Borang Kemasukan & Log Status Kelulusan (PM Submission View)

```text
+---------------------------------------------------------------------------------------------------+
| KOP-PUSAMAJU  [ Jualan ] [ Perbelanjaan ] [ Status Tuntutan ]        (👤 PM Ismail | 🔔 1 | Log Keluar)|
+---------------------------------------------------------------------------------------------------+
| PERBELANJAAN PROJEK & TUNTUTAN DOKUMEN                                                            |
| Projek Ditugaskan: [ 1. Ar-rahnu (Kewangan Islam) v ]                   [ Bajet Julai: RM 220,000.00 ]|
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  +--------------------------------------------------+ +-----------------------------------------+ |
|  | BORANG TUNTUTAN PERBELANJAAN BAHARU              | | LOG STATUS KELULUSAN TUNTUTAN (JULAI)   | |
|  +--------------------------------------------------+ +-----------------------------------------+ |
|  | Tarikh Perbelanjaan *                            | | Jumlah Dituntut: RM 210,000.00           | |
|  | [ 25/07/2026                         [📅] ]      | +-----------------------------------------+ |
|  |                                                  | | Tarikh | Kategori | Jumlah (RM) | Status  | |
|  | Kategori Perbelanjaan *                          | +--------+----------+-------------+---------+ |
|  | [ Kos Pembekal / Bahan Mentah                 [v]| | 25/07  | Pembekal |  150,000.00 | ⏳ Pend | |
|  | (Gaji, Pemasaran, Operasi, Pembekal, Sewa,       | | 18/07  | Operasi  |   35,000.00 | 🟢 Lulus| |
|  | Utiliti, Komisen, Perjalanan, Peralatan, Lain)   | | 12/07  | Utiliti  |    3,400.00 | 🟢 Lulus| |
|  |                                                  | | 05/07  | Pemasaran|    8,500.00 | 🟢 Lulus| |
|  | Jumlah Perbelanjaan (RM) *                       | | 01/07  | Gaji     |   13,100.00 | 🟢 Lulus| |
|  | [ RM  150,000.00                               ] | +--------+----------+-------------+---------+ |
|  |                                                  | | ⏳ 1 Menunggu Kelulusan CEO            | |
|  | Penerangan / Huraian Perbelanjaan *              | | 🟢 4 Diluluskan                        | |
|  | [ Pembelian simpanan emas sandaran Ar-rahnu.   ] | |                                         | |
|  |                                                  | | [* Klik pada mana-mana tuntutan *]      | |
|  | Dokumen Sokongan / Resit (Upload Receipt) *      | +-----------------------------------------+ |
|  | +----------------------------------------------+ |                                           | |
|  | |   [📄 Drag & Drop Fail Resit / Invois di sini]| |                                           | |
|  | |   atau [ Pilih Fail ] (PDF, PNG, JPG < 5MB)  | |                                           | |
|  | |   Fail dipilih: resit_pembelian_emas_25jul.pdf | |                                           | |
|  | +----------------------------------------------+ |                                           | |
|  |                                                  |                                           | |
|  | +----------------------------------------------+ |                                           | |
|  | | [ HANTAR UNTUK KELULUSAN ]    [ BATAL ]      | |                                           | |
|  | +----------------------------------------------+ |                                           | |
|  +--------------------------------------------------+                                             |
+---------------------------------------------------------------------------------------------------+
```

---

### 1.2 Pandangan CEO: Tetingkap Modal Alir Kerja Kelulusan (CEO Approval Modal View)

```text
+---------------------------------------------------------------------------------------------------+
| TETINGKAP KELULUSAN PERBELANJAAN (CEO WORKFLOW VIEW)                                          [X] |
+---------------------------------------------------------------------------------------------------+
| Tuntutan ID: #EXP-2026-0789                                 Tarikh Hantar: 25/07/2026 16:45      |
| Projek: 1. Ar-rahnu (Kewangan Islam)                        Pengurus Projek: Ismail Bin Harun     |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  +-----------------------------------------+ +--------------------------------------------------+ |
|  | MAKLUMAT TUNTUTAN                       | | PRATONTON DOKUMEN RESIT SOKONGAN               | |
|  +-----------------------------------------+ +--------------------------------------------------+ |
|  | Kategori: Kos Pembekal / Bahan Mentah   | | +----------------------------------------------+ | |
|  | Jumlah:   RM 150,000.00                | | | [📄 RESIT PEMBELIAN EMAS SANDARAN           ]| | |
|  |                                         | | | No Invois: SUPP-GOLD-9988                    ]| | |
|  | Penerangan:                             | | | Tarikh: 25 Julai 2026                        ]| | |
|  | "Pembelian simpanan emas sandaran bagi  | | | Pembekal: Poh Kong Wholesale Sdn Bhd        ]| | |
|  | cawangan utama Ar-rahnu Kop-Pusamaju."  | | | Jumlah Dibayar: RM 150,000.00               ]| | |
|  |                                         | | | [📜 Klik untuk muat turun dokumen penuh PDF] |] | |
|  | Impak Bajet Julai:                      | | +----------------------------------------------+ | |
|  | Bajet Keseluruhan : RM 220,000.00       | |                                                  | |
|  | Belanja Semasa    : RM  60,000.00       | | Catatan Kelulusan / Alasan Penolakan (Jika Ada):| |
|  | Selepas Kelulusan : RM 210,000.00 (95.4%)| | [ Diluluskan mengikut bajet kelulusan AJK  ]  | |
|  +-----------------------------------------+ +--------------------------------------------------+ |
|                                                                                                   |
|  +----------------------------------------------------------------------------------------------+ |
|  |  [ ✅ LULUSKAN PERBELANJAAN ]      [ ❌ TOLAK PERBELANJAAN ]      [ ⏳ KEKALKAN MENUNGGU ]   | |
|  +----------------------------------------------------------------------------------------------+ |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Pecahan Komponen UI (UI Component Breakdown)

1. **Borang Entry Perbelanjaan PM (PM Expense Entry Form):**
   - **Tarikh Perbelanjaan:** Pemilih tarikh (`DD/MM/YYYY`).
   - **Kategori Perbelanjaan (Expense Category Selector):** Dropdown khas mengandungi 10 kategori standard mengikut Technical Spec:
     1. Gaji dan Upah Kakitangan
     2. Kos Pemasaran dan Pengiklanan
     3. Kos Operasi Harian
     4. Kos Pembekal / Bahan Mentah
     5. Sewa Premis
     6. Utiliti (Elektrik, Air, Internet)
     7. Komisen Jualan
     8. Perjalanan dan Pengangkutan
     9. Peralatan dan Teknologi
     10. Lain-lain
   - **Jumlah (RM):** Input angka Ringgit Malaysia berformat.
   - **Penerangan / Huraian:** Textarea untuk menjelaskan tujuan perbelanjaan.

2. **Muat Naik Dokumen Resit (Drag & Drop Receipt Uploader):**
   - Drag-and-drop zone dengan pengesahan format fail (`.pdf`, `.png`, `.jpg`, `.jpeg`).
   - Had saiz fail: 5MB per fail.
   - Menunjukkan nama fail yang dipilih dan butang buang/ganti fail.

3. **Status Kelulusan & Tag Visual (Approval Status Badges):**
   - ⏳ **Menunggu Kelulusan (Pending):** Tag Kuning Gold (`#fef9c3`).
   - 🟢 **Diluluskan (Approved):** Tag Hijau Emerald (`#dcfce7`).
   - 🔴 **Ditolak (Rejected):** Tag Merah (`#fee2e2`). Mengklik tag ditolak akan memaparkan modal catatan alasan penolakan CEO.

4. **Modal Kelulusan CEO (CEO Approval Interface Modal):**
   - Memaparkan maklumat penuh perbelanjaan yang dituntut side-by-side dengan pratonton resit.
   - **Metrik Impak Bajet:** Menunjukkan pengiraan masa nyata impak tuntutan terhadap bajet bulanan projek (contoh: Belanja meningkat kepada 95.4% daripada bajet).
   - **Kawasan Catatan Kelulusan / Alasan Penolakan:** Medan input teks untuk CEO meninggalkan nota (wajib diisi jika perbelanjaan ditolak).

---

## 3. Tingkah Laku UX & Alir Kerja Kelulusan (UX & Approval Workflow Behaviors)

### 3.1 Alur Kerja Kemasukan & Kelulusan (End-to-End Approval Workflow):
1. **Langkah 1 (PM Submits):** PM mengisi borang perbelanjaan, memuat naik resit, dan mengklik `[ HANTAR UNTUK KELULUSAN ]`. Status permulaan: **Menunggu Kelulusan**.
2. **Langkah 2 (System Triggers Alert):** Sistem menjana notifikasi serta-merta kepada CEO melalui:
   - Spanduk Amaran di Papan Pemuka CEO (02_ceo_dashboard.md).
   - Penghantaran notifikasi e-mel automatik kepada CEO mengandungi pautan kelulusan pantas.
3. **Langkah 3 (CEO Reviews & Decides):** CEO mengklik tuntutan untuk membuka modal kelulusan:
   - Jika CEO mengklik **[ ✅ LULUSKAN PERBELANJAAN ]**: Status bertukar kepada **Diluluskan**, data kewangan projek dikemas kini secara rasmi, dan e-mel kelulusan dihantar kepada PM.
   - Jika CEO mengklik **[ ❌ TOLAK PERBELANJAAN ]**: CEO wajib memasukkan alasan penolakan pada medan catatan (contoh: `"Resit tidak jelas, sila muat naik semula"`). Status bertukar kepada **Ditolak**, dan PM menerima e-mel makluman.

### 3.2 Kawalan Keselamatan Audit Trail:
- Setiap tindakan kelulusan atau penolakan merekodkan identiti pengguna (CEO), cap masa (timestamp), dan alamat IP ke dalam jadual Audit Trail sistem bagi mengelakkan manipulasi rekod kewangan.
