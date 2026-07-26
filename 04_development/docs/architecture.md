# Seni Bina Sistem (Architecture)

**Ditulis oleh:** Engineer (Iskandar)  
**Status:** ⬜ Belum diisi — Engineer perlu lengkapkan

---

## Keputusan Seni Bina

*(Engineer isi di sini — contoh: frontend framework, backend approach, database, hosting)*

---

## Prinsip Yang Mesti Dipatuhi

Rujuk `00_admin/Product_Vision.md` untuk senarai penuh. Ringkasan:

- **Projek-agnostic** — tiada hardcode nama projek
- **Scalable** — boleh tambah pengguna & projek tanpa ubah kod
- **API-ready** — semua fungsi utama boleh diakses via API
- **Modular** — setiap modul berdiri sendiri
- **Bersedia untuk multi-tenancy** — jangan buat keputusan yang akan menyukarkan scale kemudian (walaupun multi-tenancy bukan dalam skop sekarang)
