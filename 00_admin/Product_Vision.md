# Product Vision — Sales Dashboard System
**Tarikh:** 25 Julai 2026  
**Disediakan oleh:** Product Manager  
**Status:** Confirmed oleh CEO

---

## Objektif Sistem

> Sistem ini adalah sebuah **Business Command Centre** — pusat kawalan perniagaan berpusat yang memberi CEO visibiliti penuh terhadap kesihatan keseluruhan koperasi dalam masa nyata.

---

## Visi Produk

> Sistem Dashboard Jualan ini dibina **pertama sekali untuk Koperasi Pembangunan Usahasama Masyarakat Maju Sabah Berhad (Kop-Pusamaju)** sebagai pelanggan pertama (pilot customer), dengan visi jangka panjang untuk **dijual kepada koperasi-koperasi lain di Malaysia** sebagai produk SaaS (Software as a Service) komersial.

---

## Misi

Membina sebuah sistem pengurusan jualan dan pemantauan prestasi yang direka khas untuk koperasi di Malaysia — mudah digunakan, boleh disesuaikan, dan mampu berkembang bersama organisasi.

---

## Pelanggan Sasaran

**Fasa 1 (Pilot)**
- Kop-Pusamaju — koperasi dengan 10 projek aktif, ~10 pengguna, beroperasi di Malaysia

**Fasa 2 dan seterusnya (SaaS)**
- Koperasi-koperasi lain di Malaysia
- Organisasi yang mempunyai pelbagai sumber pendapatan dan memerlukan sistem pemantauan berpusat

---

## Prinsip Panduan Pembangunan

Setiap keputusan reka bentuk dan pembangunan mesti mengambil kira prinsip-prinsip berikut:

### 1. Multi-Tenancy *(Fasa 5 — bukan sekarang)*
- Setiap koperasi (tenant) mendapat persekitaran mereka sendiri
- Data antara koperasi diasingkan sepenuhnya — tiada kebocoran data antara tenant
- Satu platform, banyak koperasi boleh guna serentak
- **Untuk Fasa 1-4: bina untuk satu koperasi, tetapi jangan buat keputusan yang akan menyukarkan multi-tenancy kemudian**

### 2. White-Label Ready
- Logo, nama syarikat, warna tema boleh dikustomkan untuk setiap koperasi
- Sistem tidak terikat kepada identiti visual mana-mana satu koperasi

### 3. Projek-Agnostic
- Tiada had bilangan projek — koperasi boleh tambah projek baru sendiri
- Setiap projek baru automatically dapat semua feature (entry form, sasaran, KPI, laporan, alert)
- Tiada hardcoding nama projek dalam sistem

### 4. Scalable
- Sistem kena boleh handle pertumbuhan pengguna dan projek tanpa perlu tulis semula kod
- Infrastruktur boleh dibesarkan (scale up) mengikut keperluan

### 5. API-Ready
- Semua fungsi utama mesti boleh diakses melalui API
- Membolehkan integrasi dengan sistem luar (QuickBooks, SQL Accounting, Penggajian) pada Fasa 2
- Membolehkan sambungan AI/ML pada masa hadapan

### 6. Modular
- Setiap modul (Jualan, Perbelanjaan, Laporan, KPI, Pengguna) berdiri sendiri
- Modul baru boleh ditambah tanpa mengganggu modul yang sedia ada

---

## Pelan Fasa (Semula)

| Fasa | Fokus | Penerima Manfaat |
|---|---|---|
| **Fasa 1 — MVP** | Dashboard asas, entry jualan & perbelanjaan, laporan, KPI | Kop-Pusamaju |
| **Fasa 2 — Integrasi** | Sambung dengan QuickBooks/SQL/Penggajian, notifikasi WhatsApp | Kop-Pusamaju |
| **Fasa 3 — AI & Analytics** | Ramalan jualan, pandangan AI, cadangan automatik | Kop-Pusamaju |
| **Fasa 4 — Pengembangan** | White-label, subscription/licensing, onboarding koperasi baharu | Koperasi lain di Malaysia |
| **Fasa 5 — Multi-Tenancy** | Infrastruktur multi-tenant penuh, pengasingan data sepenuhnya antara koperasi | Semua pelanggan |

> **Nota:** Multi-Tenancy akan dibangunkan pada fasa tersendiri apabila tiba masanya. Fasa 1 hingga 4 fokus kepada satu koperasi dahulu.

---

## Nota untuk Engineer

> Walaupun kita bina untuk satu koperasi dahulu, **jangan buat keputusan yang akan menyukarkan kita untuk scale kepada multi-tenant kemudian.** Sebarang shortcut hari ini akan jadi hutang teknikal (technical debt) yang mahal bila tiba masanya nak jual kepada koperasi lain.

Perkara yang **MESTI** dibuat betul dari Fasa 1:
- Database schema yang menyokong multi-tenancy (tenant_id pada setiap rekod)
- Authentication yang boleh diasingkan mengikut organisasi
- Settings dan konfigurasi yang boleh dikustomkan per-tenant
- Tiada nilai yang hardcoded — semua boleh dikonfigurasi

---

*Dokumen ini adalah panduan strategik jangka panjang. Semua ahli pasukan (PM dan Engineer) wajib baca dan fahami sebelum memulakan pembangunan.*
