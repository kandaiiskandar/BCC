# Wireframe Specs — Pengurusan Pengguna (User Management Screen)

## 1. Gambaran Keseluruhan Skrin
Skrin ini digunakan oleh **Admin** dan **Super Admin** untuk menambah pengguna baru, mengemaskini peranan, menetapkan tugasan projek kepada Pengurus Projek (PM), atau menyahaktifkan akaun apabila kakitangan meninggalkan koperasi.

---

## 2. Lakaran Layout (ASCII Wireframe)

```
+-------------------------------------------------------------------------------------------------------+
| KOP-PUSAMAJU Command Centre  [Pengguna] [Tetapan Sistem] [Audit Trail]                   | [Admin User] |
+-------------------------------------------------------------------------------------------------------+
|                                                                                                       |
| PENGURUSAN PENGGUNA SISTEM                                                    [ + TAMBAH PENGGUNA ]   |
| Urus keahlian pengguna, peranan capaian, dan tugasan projek.                                          |
|                                                                                                       |
| SENARAI PENGGUNA AKTIF                                                                                |
| +---------------------------------------------------------------------------------------------------+ |
| | Nama Penuh      | Alamat E-mel         | Peranan        | Projek Ditugaskan       | Status  | Pilihan | |
| +-----------------+----------------------+----------------+-------------------------+---------+---------+ |
| | Iskandar        | iskandar@koperasi.my | Super Admin    | Semua Projek            | 🟢 Aktif | [Edit]  | |
| | Ahmad Fauzi     | ahmad@koperasi.my    | CEO            | Semua Projek            | 🟢 Aktif | [Edit]  | |
| | Siti Sarah      | sarah@koperasi.my    | Project Manager| Ar-rahnu, Freshmart     | 🟢 Aktif | [Edit]  | |
| | Mohd Nor        | nor@koperasi.my      | Project Manager| Pasaraya                | 🟢 Aktif | [Edit]  | |
| | Rohani Ali      | rohani@koperasi.my   | Director       | Semua Projek (Lihat)    | 🟢 Aktif | [Edit]  | |
| | Khairul         | khairul@koperasi.my  | Admin          | Tiada                   | 🟢 Aktif | [Edit]  | |
| +---------------------------------------------------------------------------------------------------+ |
|                                                                                                       |
| POPUP MODAL (Tambah / Edit Pengguna):                                                                 |
| +---------------------------------------------------------------------------------------------------+ |
| | Tambah / Kemaskini Pengguna                                                                   [X] | |
| |                                                                                                   | |
| | Nama Penuh:                                     Alamat E-mel:                                     | |
| | [ Siti Sarah                              ]     [ sarah@koperasi.my                       ]       | |
| |                                                                                                   | |
| | Peranan Sistem (Role):                          Status Akaun:                                     | |
| | [ Pengurus Projek (Project Manager)     v ]     [ (o) Aktif   ( ) Nyahaktif ]                     | |
| |                                                                                                   | |
| | Tugasan Projek (Hanya untuk Pengurus Projek):                                                     | |
| | [X] Ar-rahnu   [ ] Pasaraya   [X] Freshmart   [ ] Pembangunan Hartanah   [ ] Pembiayaan Peribadi  | |
| | [ ] Hardware   [ ] PCS        [ ] Pembekal    [ ] Insurans               [ ] Pelancongan & Umrah  | |
| |                                                                                                   | |
| |                                                                    [ Batal ]  [ SIMPAN PROFIL ]   | |
| +---------------------------------------------------------------------------------------------------+ |
+-------------------------------------------------------------------------------------------------------+
```

---

## 3. Komponen UI & Fungsi

| # | Komponen | Jenis | Teks / Label (BM) | Fungsi / Tingkah Laku |
|---|---|---|---|---|
| 1 | Butang Tambah | Primary CTA Button | + TAMBAH PENGGUNA | Membuka modal pop-up kosong untuk mendaftar pengguna baru |
| 2 | Jadual Pengguna | Data Table | Senarai Pengguna Aktif | Menunjukkan semua pengguna dengan peranan dan senarai projek yang diuruskan |
| 3 | Butang Edit | Inline Action | Edit | Membuka modal dengan data pengguna sedia ada untuk dikemaskini |
| 4 | Input Nama | Text Input | Nama Penuh | Memasukkan nama penuh kakitangan |
| 5 | Input E-mel | Email Input | Alamat E-mel | Alamat e-mel rasmi untuk dihantar jemputan log masuk |
| 6 | Dropdown Peranan| Dropdown Select | Peranan Sistem | Memilih salah satu daripada 5 peranan standard (Admin, CEO, dll.) |
| 7 | Status Akaun | Radio Buttons | Status Akaun | Mengaktifkan atau menyahaktifkan akaun |
| 8 | Checkbox Projek | Group Checkboxes| Tugasan Projek | Dipaparkan hanya jika peranan 'Project Manager' dipilih |
| 9 | Butang Simpan | Primary Button | SIMPAN PROFIL | Menghantar profil baharu / dikemaskini ke API `/profiles` |

---

## 4. Alur Pengguna (User Flow)
1. Admin menavigasi ke `/users` (Pengguna).
2. Sistem memuatkan senarai profil menggunakan `/rest/v1/profiles` bersama maklumat pemetaan dalam `user_project_assignments`.
3. Admin klik **[+ TAMBAH PENGGUNA]** $\rightarrow$ Isi Borang $\rightarrow$ Pilih peranan **Project Manager** $\rightarrow$ Tandakan kotak **Ar-rahnu** dan **Freshmart** $\rightarrow$ Klik **SIMPAN PROFIL**.
4. Borang diserahkan. Supabase Auth mencipta akaun (atau menjemput melalui e-mel), disusuli trigger PostgreSQL `handle_new_user()` memasukkan rekod ke dalam `profiles`.
5. Junction table `user_project_assignments` diisi dengan baris tugasan projek yang dipilih.
6. Akaun dinyahaktifkan: Jika PM meninggalkan koperasi, status ditukar ke **Nyahaktif** $\rightarrow$ RLS menyekat akaun tersebut daripada log masuk atau membuat sebarang pertanyaan pangkalan data, tetapi rekod sejarah tetap dikekalkan.
