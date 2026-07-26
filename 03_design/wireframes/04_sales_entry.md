# Wireframe 04: Borang Kemasukan Jualan (Sales Entry Form - PM View)

**Fail Reka Bentuk:** `03_design/wireframes/04_sales_entry.md`  
**Sasaran Pengguna:** Pengurus Projek (PM), CEO (akses lihat/edit)  
**Status Skrin:** Mandatori (Fasa 1 MVP - Primary Data Input)  

---

## 1. Susun Atur Wireframe (ASCII Layout Diagram)

### 1.1 Pandangan Desktop 2-Lajur (Dual-Column Desktop View)

```text
+---------------------------------------------------------------------------------------------------+
| KOP-PUSAMAJU  [ Kemasukan Jualan ] [ Perbelanjaan ] [ Sejarah ]      (👤 PM Ismail | 🔔 1 | Log Keluar)|
+---------------------------------------------------------------------------------------------------+
| BORANG KEMASUKAN JUALAN BULANAN / HARIAN                                                          |
| Projek Ditugaskan: [ 1. Ar-rahnu (Kewangan Islam) v ]                   [ Bulan Kemasukan: Julai 2026 ]|
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  +--------------------------------------------------+ +-----------------------------------------+ |
|  | BORANG KEMASUKAN JUALAN BAHARU                   | | SEJARAH KEMASUKAN JUALAN TERKINI (JULAI)| |
|  +--------------------------------------------------+ +-----------------------------------------+ |
|  | Tarikh Jualan *                                  | | Ringkasan Julai: RM 400,000.00 (5 Transaksi)  | |
|  | [ 26/07/2026                         [📅] ]      | +-----------------------------------------+ |
|  |                                                  | | Tarikh | Klien / Produk | Jumlah (RM)| Action | |
|  | Jenis Hasil *                                    | +--------+----------------+------------+--------+ |
|  | (o) Jualan Biasa   ( ) Hasil Berulang (Langganan)| | 25/07  | Klien Sykt A   | 120,000.00 | [Edit] | |
|  | ( ) Bayaran Pendahuluan (Deposit)                | | 20/07  | Transaksi B    |  80,000.00 | [Edit] | |
|  |                                                  | | 15/07  | Langganan C    | 100,000.00 | [Edit] | |
|  | Jumlah Hasil (RM) *                              | | 10/07  | Deposit D      |  50,000.00 | [Edit] | |
|  | [ RM  150,000.00                               ] | | 02/07  | Transaksi E    |  50,000.00 | [Edit] | |
|  |                                                  | +--------+----------------+------------+--------+ |
|  | Nama Klien / Pelanggan *                         | | Memaparkan 5 entry terkini bulan ini. | |
|  | [ Syarikat Pembangunan Teguh Sdn Bhd           ] | |                                         | |
|  |                                                  | | [ 📊 Muat Turun Rekod Kemasukan (.xlsx) ] | |
|  | Jenis Produk / Perkhidmatan *                    | +-----------------------------------------+ |
|  | [ Skim Pajak Gadai Emas - Pakej Korporat       ] |                                           | |
|  |                                                  |                                           | |
|  | Kaedah Pembayaran *                              |                                           | |
|  | [ Pindahan Bank Direct (Online Transfer)      [v]| |                                           | |
|  |                                                  |                                           | |
|  | Nombor Invois / Nombor Rujukan                    |                                           | |
|  | [ INV-2026-AR-0089                             ] |                                           | |
|  |                                                  |                                           | |
|  | Nota / Catatan Tambahan                          |                                           | |
|  | [ Bayaran penuh telah diterima menerusi bank.  ] |                                           | |
|  | [                                              ] |                                           | |
|  |                                                  |                                           | |
|  | +----------------------------------------------+ |                                           | |
|  | | [ HANTAR JUALAN ] [ SIMPAN DRAF ]  [ BATAL ] | |                                           | |
|  | +----------------------------------------------+ |                                           | |
|  +--------------------------------------------------+                                             |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Pecahan Komponen UI (UI Component Breakdown)

1. **Pemilih Projek Ditugaskan (Assigned Project Dropdown):**
   - Dropdown memaparkan projek yang diumpukkan kepada PM berkenaan sahaja. Sekiranya PM mengurus lebih daripada 1 projek, dropdown membolehkannya bertukar borang mengikut projek.

2. **Medan Tarikh Jualan (Sales Date Field):**
   - Input jenis tarikh dengan ikon kalendar `[📅]`. Format standard: `DD/MM/YYYY`. Nilai lalai (default): Tarikh hari ini.

3. **Pilihan Jenis Hasil (Revenue Type Radio Group):**
   - **Jualan Biasa (Standard Sales):** Jualan transaksi satu kali (one-off).
   - **Hasil Berulang (Recurring Revenue):** Hasil berulang bulanan/langganan.
   - **Bayaran Pendahuluan (Deposit / Advance Payment):** Deposit projek yang direkod secara berasingan untuk pengiktirafan hasil yang tepat.

4. **Medan Jumlah Hasil (Currency Amount Input - RM):**
   - Awalan tetap `RM`. Teks input bersaiz besar (18px Semi-Bold).
   - Menepati format nombor mata wang automatik (cth: `150,000.00`).

5. **Medan Klien, Produk & Kaedah Pembayaran:**
   - **Nama Klien / Pelanggan:** Text field (Mandatori).
   - **Jenis Produk / Perkhidmatan:** Text field / Autocomplete dropdown produk (Mandatori).
   - **Kaedah Pembayaran:** Dropdown pilihan (`Tunai`, `Pindahan Bank Direct`, `Kad Kredit / Debit`, `Cek`).
   - **Nombor Invois / Rujukan:** Input teks untuk nombor invois atau rujukan bank.

6. **Medan Catatan / Nota Tambahan:**
   - Multi-line textarea untuk sebarang catatan khas berkenaan transaksi.

7. **Butang Tindakan Borang (Form Actions):**
   - **HANTAR JUALAN (Primary CTA):** Warna latar belakang `--color-emerald-600` (`#10b981`).
   - **SIMPAN DRAF (Secondary Button):** Membolehkan PM menyimpan borang untuk dilengkapkan kemudian.
   - **BATAL (Ghost Button):** Mengosongkan semula borang.

8. **Panel Sejarah Kemasukan Terkini (Recent Sales Entries Table):**
   - Terpapar di lajur sebelah kanan (Desktop view) bagi membolehkan PM menyemak rekod jualan yang telah dihantar untuk bulan semasa, berserta jumlah terkumpul (RM 400,000.00).
   - Pautan `[Edit]` membolehkan pengemaskinian rekod dalam tempoh tetingkap masa yang dibenarkan (audit-tracked edit).

---

## 3. Tingkah Laku UX & Interaksi (UX Behaviors & Interactions)

### 3.1 Pemformatan Matang Ringgit Malaysia (Live Currency Formatting):
- Semasa pengguna menaip angka pada medan Jumlah Hasil (contohnya menaip `150000`), sistem akan memformatkannya secara automatik kepada `RM 150,000.00` sebaik sahaja fokus keluar (onBlur) atau secara live (debounced).

### 3.2 Pengesahan Mandatori (Strict Form Validation):
- Jika mana-mana medan mandatori (`*`) tidak diisi, butang hantar tidak akan memproses transaksi. Medan yang tertinggal akan dinyalakan dengan sempadan merah (`#ef4444`) berserta mesej amaran: `"Sila lengkapkan medan ini sebelum menghantar"`.

### 3.3 Penjimatan Draf Automatik (Draft Saving):
- Mengklik "SIMPAN DRAF" akan menyimpan input dalam storan tempatan / draf database. Notifikasi hijau halus dipaparkan di bawah borang: `"Draf jualan telah disimpan pada 14:32:05"`.

### 3.4 Notifikasi Automatik Kepada CEO:
- Sebaik sahaja butang "HANTAR JUALAN" diklik:
  1. Dialog pengesahan muncul: `"Sahkan penghantaran rekod jualan RM 150,000.00 bagi projek Ar-rahnu?"`.
  2. Apabila disahkan, rekod disimpan ke pangkalan data dan status dikemas kini.
  3. Jadual sejarah di sebelah kanan mengemas kini nilai secara langsung.
  4. Amaran notifikasi dikirimkan kepada Papan Pemuka CEO.
