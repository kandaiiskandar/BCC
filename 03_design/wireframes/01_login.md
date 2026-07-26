# Wireframe 01: Skrin Log Masuk (Login Screen)

**Fail Reka Bentuk:** `03_design/wireframes/01_login.md`  
**Sasaran Pengguna:** Semua pengguna (Super Admin, CEO, Director, Pengurus Projek, Admin)  
**Status Skrin:** Mandatori (Fasa 1 MVP)  

---

## 1. Susun Atur Wireframe (ASCII Layout Diagram)

### 1.1 Pandangan Desktop (Desktop Layout)

```text
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                                KOP-PUSAMAJU                                       |
|                         BUSINESS COMMAND CENTRE SYSTEM                            |
|                                                                                   |
|                   +-------------------------------------------+                   |
|                   |                LOG MASUK                  |                   |
|                   |  Sila masukkan kelayakan akses anda.      |                   |
|                   |                                           |                   |
|                   |  E-mel / ID Pengguna *                    |                   |
|                   |  [ pm.arrahnu@kopusamaju.com.my         ] |                   |
|                   |                                           |                   |
|                   |  Kata Laluan *                            |                   |
|                   |  [ **********                          [o] ] |                   |
|                   |                                           |                   |
|                   |  [x] Ingat Saya         Lupa Kata Laluan? |                   |
|                   |                                           |                   |
|                   |  +-------------------------------------+  |                   |
|                   |  |          LOG MASUK SISTEM           |  |                   |
|                   |  +-------------------------------------+  |                   |
|                   +-------------------------------------------+                   |
|                                                                                   |
|                     [🔒 Sambungan Selamat SSL Aktif]                              |
|                                                                                   |
|          Sistem Dashboard Jualan Koperasi v1.0.0 © 2026 Kop-Pusamaju              |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### 1.2 Pandangan Responsif Mudah Alih (Mobile Responsive View)

```text
+-----------------------------------+
|                                   |
|            KOP-PUSAMAJU           |
|                                   |
|    +-------------------------+    |
|    |        LOG MASUK        |    |
|    |                         |    |
|    |  E-mel / ID Pengguna *  |    |
|    |  [                     ]    |
|    |                         |    |
|    |  Kata Laluan *          |    |
|    |  [                [o] ]    |
|    |                         |    |
|    |  [x] Ingat Saya         |    |
|    |  Lupa Kata Laluan?      |    |
|    |                         |    |
|    |  +-------------------+  |    |
|    |  |  LOG MASUK SISTEM |  |    |
|    |  +-------------------+  |    |
|    +-------------------------+    |
|                                   |
|      [🔒 Sambungan Selamat]       |
|                                   |
|       © 2026 Kop-Pusamaju         |
|                                   |
+-----------------------------------+
```

---

## 2. Pecahan Komponen UI (UI Component Breakdown)

1. **Logo & Pengepala Utama (Branding Header):**
   - Logo visual Kop-Pusamaju terpapar di bahagian atas (dalam mod white-label, ini akan membaca nama tenant dari database setting).
   - Teks sub-tajuk: "BUSINESS COMMAND CENTRE SYSTEM" berwarna Slate Gray (`#64748b`).

2. **Kotak Kad Log Masuk (Login Card Container):**
   - Latar belakang putih `#ffffff`, radius 8px (`rounded-lg`), bayangan halus (`shadow-lg`).
   - Lebar tetap (fixed width) pada desktop: 420px; lebar fleksibel (fluid width) pada peranti mudah alih: 90%.

3. **Medan Input E-mel / ID Pengguna (Email / Username Input Field):**
   - Label: "E-mel / ID Pengguna *" (Teks bold 12px, warna `#334155`).
   - Placeholder: "contoh@kopusamaju.com.my".
   - Sempadan input kelabu `#cbd5e1`. Bertukar hijau `--color-emerald-600` apabila dipilih (active state).

4. **Medan Input Kata Laluan (Password Input Field):**
   - Label: "Kata Laluan *" (Teks bold 12px, warna `#334155`).
   - Butang Toggled Mata `[o]`: Membolehkan pengguna melihat atau menyembunyikan teks kata laluan.
   - Menyokong input kata laluan tersimpan pengurus kata laluan (password manager compliant).

5. **Pilihan "Ingat Saya" & Pautan "Lupa Kata Laluan":**
   - Kotak tanda "Ingat Saya" (Checkbox) di penjuru kiri bawah.
   - Pautan "Lupa Kata Laluan?" di penjuru kanan bawah berwarna Navy Blue (`#1e293b`), bertukar kepada Emerald Green (`#10b981`) dengan garisan bawah (underline) apabila di-hover.

6. **Butang Tindakan Log Masuk (Primary CTA Button):**
   - Butang bersaiz besar (height 48px, radius 6px).
   - Warna latar belakang utama: `--color-navy-800` (`#1e293b`). Hover: `--color-navy-700` (`#334155`).
   - Label: "LOG MASUK SISTEM" (Teks Putih Bold 14px Uppercase).

7. **Lencana Keselamatan & Footer:**
   - Label "🔒 Sambungan Selamat SSL Aktif" di bawah kotak kad untuk membina keyakinan keselamatan data kewangan.
   - Hak cipta: "Sistem Dashboard Jualan Koperasi v1.0.0 © 2026 Kop-Pusamaju".

---

## 3. Tingkah Laku UX & Interaksi (UX Behaviors & Interactions)

### 3.1 Pengesahan Input (Client-Side Validation):
- **Input Kosong:** Jika butang log masuk ditekan dengan medan e-mel atau kata laluan kosong, sempadan medan bertukar merah (`#ef4444`) dan teks amaran dipaparkan: `"Medan ini adalah mandatori"`.
- **Format E-mel:** Mengesahkan format e-mel yang betul. Jika salah, amaran `"Sila masukkan format e-mel yang sah"` dipaparkan.

### 3.2 Keadaan Proses / Pemuatan (Loading State):
- Sebaik sahaja butang diklik dan pengesahan berjaya, butang akan bertukar ke mod lumpuh (disabled), teks disembunyikan dan ikon roda berpusing (loading spinner) dipaparkan untuk mengelakkan klik berkali-kali.

### 3.3 Pengendalian Ralat Log Masuk (Error Handling):
- Sekiranya nama pengguna atau kata laluan salah semasa pengesahan backend, paparan ralat global berwarna merah muncul di bahagian atas kad log masuk:
  `"Ralat: ID Pengguna atau Kata Laluan tidak sah. Sila cuba lagi."`
- Bagi mengelakkan cubaan pecah masuk (Brute-force attack), akaun dikunci sementara selama 15 minit selepas 5 kegagalan berturut-turut. Teks amaran ditunjukkan.

### 3.4 Alur Hala Tuju Pengguna (Role-Based Redirection):
Selepas log masuk berjaya, pengguna dihalakan secara dinamik berdasarkan peranan akaun:
- **CEO & Director:** Dihalakan terus ke **Papan Pemuka CEO (02_ceo_dashboard.md)**.
- **Pengurus Projek (PM):** Dihalakan terus ke **Borang Kemasukan Jualan (04_sales_entry.md)** dengan projek pertama yang ditugaskan terpilih secara lalai.
- **Super Admin & Admin:** Dihalakan ke halaman Pentadbiran Pengguna (User Management).
