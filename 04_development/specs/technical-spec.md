# Technical Specification — Fasa 1 MVP
## Sales Dashboard — Koperasi Pembangunan Usahasama Masyarakat Maju Sabah Berhad (Kop-Pusamaju)

**Ditulis oleh:** Product Manager  
**Untuk:** Engineer (Iskandar)  
**Tarikh:** 25 Julai 2026  
**Versi:** 1.0  
**Status:** Sedia untuk semakan Engineer

---

## 1. Ringkasan Projek

Kop-Pusamaju adalah sebuah koperasi yang beroperasi di Malaysia dengan 10 projek aktif merentasi pelbagai industri. CEO kehilangan kawalan terhadap prestasi perniagaan kerana tiada satu sistem berpusat untuk memantau hasil, perbelanjaan, dan untung/rugi merentasi semua projek.

Sistem ini adalah sebuah **Business Command Centre** — pusat kawalan perniagaan berpusat yang memberi CEO visibiliti penuh terhadap kesihatan keseluruhan koperasi dalam masa nyata.

Ia akan membina sebuah **dashboard pengurusan jualan berasaskan web** yang membolehkan:
- CEO memantau keseluruhan prestasi koperasi dalam masa nyata
- Pengurus projek menghantar laporan jualan dan perbelanjaan bulanan
- Laporan automatik dijanakan dan diedarkan kepada pihak berkenaan

**Visi jangka panjang:** Sistem ini akan dijual kepada koperasi-koperasi lain di Malaysia sebagai produk SaaS komersial. Setiap keputusan pembangunan mesti mengambil kira skala masa depan ini.

---

## 2. Skop Fasa 1

### Termasuk dalam Fasa 1
- Dashboard utama CEO dengan KPI, carta, dan ringkasan prestasi
- Modul entry jualan bulanan per projek
- Modul entry perbelanjaan dengan alur kelulusan
- Modul sasaran bulanan per projek
- Modul KPI dan skor prestasi
- Sistem laporan automatik (PDF, Excel, Google Sheets)
- Sistem amaran melalui email
- Modul user management dengan role-based access control
- Jejak audit (audit trail)

### Tidak Termasuk dalam Fasa 1 (Fasa Kemudian)
- Integrasi dengan QuickBooks, SQL Accounting, sistem penggajian
- Notifikasi WhatsApp
- Ramalan jualan dan pandangan AI
- Sistem sebut harga dan invois
- Multi-tenancy
- Migrasi data sejarah dari sistem lama

---

## 3. Pengguna & Peranan

### 3.1 Senarai Peranan

| Peranan | Penerangan |
|---|---|
| **Super Admin** | Akses penuh — urus semua tetapan, pengguna, dan data sistem |
| **CEO** | Pantau semua projek, set sasaran, jana laporan, terima semua amaran |
| **Director / Management** | Lihat gambaran keseluruhan semua projek, tidak boleh edit data |
| **Pengurus Projek** | Entry jualan & perbelanjaan projek yang ditugaskan sahaja |
| **Admin** | Urus pengguna, assign peranan, tetapan sistem |

### 3.2 Matriks Hak Akses

| Fungsi | Super Admin | CEO | Director | Pengurus Projek | Admin |
|---|---|---|---|---|---|
| Lihat semua projek | ✅ | ✅ | ✅ | ❌ | ✅ |
| Lihat projek sendiri | ✅ | ✅ | ✅ | ✅ | ✅ |
| Entry jualan | ✅ | ✅ | ❌ | ✅ | ❌ |
| Entry perbelanjaan | ✅ | ✅ | ❌ | ✅ | ❌ |
| Lulus perbelanjaan | ✅ | ✅ | ❌ | ❌ | ❌ |
| Set sasaran projek | ✅ | ✅ | ❌ | ❌ | ❌ |
| Jana laporan | ✅ | ✅ | ✅ | ❌ | ❌ |
| Urus pengguna | ✅ | ❌ | ❌ | ❌ | ✅ |
| Tetapan sistem | ✅ | ❌ | ❌ | ❌ | ✅ |
| Lihat audit trail | ✅ | ✅ | ❌ | ❌ | ✅ |

### 3.3 Catatan Penting
- Seorang pengurus projek boleh ditugaskan kepada **lebih daripada satu projek**
- Bilangan pengguna bermula ~10 orang dan **boleh bertambah** — sistem mesti scalable
- CEO menguruskan akaun pengguna bersama Admin

---

## 4. Senarai Projek (Semasa)

| # | Nama Projek | Industri |
|---|---|---|
| 1 | Ar-rahnu | Perkhidmatan kewangan Islam (pajak gadai) |
| 2 | Pasaraya | Runcit |
| 3 | Freshmart | Runcit / Produk segar |
| 4 | Pembangunan Hartanah | Hartanah |
| 5 | Pembiayaan Peribadi | Kewangan |
| 6 | Hardware | Perkakasan / Bahan binaan |
| 7 | Portable Container System (PCS) | Infrastruktur |
| 8 | Pembekal Barangan Runcit | Pembekalan |
| 9 | Insurans | Insurans |
| 10 | Pelancongan dan Umrah | Pelancongan |

> **Penting:** Bilangan projek akan **bertambah** pada masa hadapan. Sistem mesti projek-agnostic — Admin boleh tambah projek baru tanpa bantuan engineer.

---

## 5. Modul & Fungsi

### 5.1 Modul Dashboard (CEO & Director)

**Halaman utama yang dipapar apabila log masuk sebagai CEO atau Director.**

KPI Cards (bahagian atas):
- Jumlah hasil bulan ini (RM)
- Jumlah perbelanjaan bulan ini (RM)
- Keuntungan / Kerugian bersih bulan ini (RM)
- Bilangan projek mencapai sasaran vs tidak mencapai

Carta & Visual:
- Carta bar — trend hasil bulanan (12 bulan terkini)
- Carta pai — pecahan hasil mengikut projek (%)
- Carta garis — pertumbuhan hasil dari masa ke masa
- Progress bar — sasaran vs aktual per projek
- Jadual data — ringkasan semua projek (hasil, perbelanjaan, untung/rugi, % sasaran)

Penapisan (Filter):
- Bulan semasa
- Bulan lepas
- 3 bulan terkini
- Suku tahun semasa
- Tahun semasa (year-to-date)
- Tahun lepas
- Perbandingan tahun ke tahun (YoY)

Drill-down:
- CEO boleh klik mana-mana projek untuk lihat pecahan terperinci projek tersebut

---

### 5.2 Modul Entry Jualan

**Digunakan oleh Pengurus Projek untuk rekod jualan bulanan.**

Field yang diperlukan:
- Tarikh jualan
- Jumlah hasil (RM)
- Jenis hasil — jualan biasa / hasil berulang (langganan) / bayaran pendahuluan (deposit)
- Nama klien / pelanggan
- Jenis produk atau perkhidmatan
- Kaedah pembayaran — tunai / pindahan bank / kad
- Nombor invois / nombor rujukan
- Nota tambahan

Ciri tambahan:
- Pengurus projek boleh lihat sejarah entry mereka
- Pecahan mengikut jenis produk/perkhidmatan dalam projek
- Hasil berulang dan bayaran pendahuluan direkod secara berasingan

---

### 5.3 Modul Entry Perbelanjaan

**Digunakan oleh Pengurus Projek untuk rekod perbelanjaan projek.**

Field yang diperlukan:
- Tarikh perbelanjaan
- Kategori perbelanjaan:
  - Gaji dan upah kakitangan
  - Kos pemasaran dan pengiklanan
  - Kos operasi harian
  - Kos pembekal / bahan mentah
  - Sewa premis
  - Utiliti (elektrik, air, internet)
  - Komisen jualan
  - Perjalanan dan pengangkutan
  - Peralatan dan teknologi
  - Lain-lain
- Jumlah (RM)
- Penerangan / huraian
- Dokumen sokongan (resit / invois) — upload fail
- Status — Menunggu Kelulusan / Diluluskan / Ditolak

Alur Kelulusan Perbelanjaan:
1. Pengurus Projek hantar perbelanjaan → Status: **Menunggu Kelulusan**
2. CEO terima notifikasi email
3. CEO lulus atau tolak → Status dikemaskini
4. Pengurus Projek terima notifikasi keputusan

Kos Bersama Syarikat:
- Admin boleh rekod kos bersama di peringkat syarikat
- Kos bersama boleh diagihkan kepada projek secara manual atau berkadar (configurable dalam Settings)

---

### 5.4 Modul Sasaran & KPI

**Digunakan oleh CEO untuk set sasaran dan pantau prestasi.**

Sasaran Per Projek (bulanan):
- Sasaran hasil minimum (RM)
- Sasaran margin keuntungan minimum (%)
- Ditetapkan oleh CEO bersama Pengurus Projek
- Boleh dikemaskini bila-bila masa

KPI yang dijejak:
- Bilangan klien baharu
- Bilangan transaksi / tawaran yang ditutup
- Margin keuntungan bersih (%)
- Pertumbuhan hasil berbanding bulan lepas (%)

Skor Prestasi Individu:
- Setiap pengurus projek ada skor prestasi berdasarkan pencapaian KPI
- Dipaparkan dalam dashboard CEO

Penunjuk Visual:
- 🟢 Hijau — mencapai atau melebihi sasaran
- 🟡 Kuning — 80%–99% sasaran
- 🔴 Merah — di bawah 80% sasaran

> **Nota:** Semua nilai sasaran dan ambang boleh dikustomkan oleh CEO dalam Settings.

---

### 5.5 Modul Laporan

**Jana dan edar laporan secara automatik atau manual.**

Kandungan Laporan:
- Ringkasan hasil, perbelanjaan, dan untung/rugi
- Pecahan per projek
- Perbandingan sasaran vs aktual
- Trend bulanan dan tahunan
- Prestasi KPI

Penjanaan Automatik:
- Laporan dijana secara automatik pada **1 haribulan** setiap bulan
- Diedarkan melalui email kepada:
  - CEO
  - Pengurus Projek masing-masing (laporan projek sendiri sahaja)
  - Pelabur / Lembaga Pengarah
  - Pasukan Kewangan

Format Eksport:
- PDF — untuk pembentangan dan perkongsian
- Excel (.xlsx) — untuk analisis lanjut
- Google Sheets — untuk perkongsian dalam talian
- Cetakan (print-friendly view)

Penjanaan Manual:
- CEO boleh jana laporan bila-bila masa dengan pilih tarikh dan projek

---

### 5.6 Modul Sistem Amaran (Email)

**Hantar amaran automatik melalui email apabila situasi tertentu berlaku.**

Trigger Amaran:
| Situasi | Penerima |
|---|---|
| Projek belum hantar data menjelang tarikh akhir | CEO + Pengurus Projek berkenaan |
| Hasil jatuh di bawah ambang yang ditetapkan | CEO |
| Perbelanjaan melebihi bajet | CEO |
| Projek melebihi sasaran (amaran positif) | CEO + Pengurus Projek berkenaan |
| Akaun belum bayar melebihi tempoh | CEO |
| Laporan bulanan telah sedia | CEO + semua penerima laporan |
| Perbelanjaan menunggu kelulusan | CEO |

Peringatan Automatik kepada Pengurus Projek:
- Hantar peringatan email jika belum hantar data menjelang tarikh yang ditetapkan (configurable)

---

### 5.7 Modul User Management

**Digunakan oleh Admin untuk urus pengguna sistem.**

Fungsi:
- Tambah pengguna baharu
- Edit maklumat pengguna
- Assign peranan kepada pengguna
- Assign projek kepada Pengurus Projek
- Nyahaktif akaun pengguna
- Set semula kata laluan

Apabila Pengurus Projek Meninggalkan Syarikat:
- Akaun dinyahaktifkan
- Data dipindahkan / diassign kepada pengurus projek baharu
- Rekod sejarah kekal dalam sistem

---

## 6. Business Rules

1. Pengurus Projek **hanya boleh** lihat dan masukkan data untuk projek yang ditugaskan kepada mereka
2. Semua perbelanjaan mesti mendapat **kelulusan CEO** sebelum disahkan dalam sistem
3. Laporan dijana secara **automatik pada 1 haribulan** setiap bulan
4. Sasaran dan ambang KPI adalah **boleh dikustomkan** — CEO set sendiri dalam Settings
5. Kos bersama syarikat boleh diagihkan kepada projek secara **manual atau berkadar** — configurable
6. Sistem menghantar **peringatan email** kepada pengurus projek yang belum hantar data menjelang tarikh akhir
7. Setiap tindakan dalam sistem **direkod dalam audit trail** — siapa, apa, dan bila
8. Bilangan projek **tidak terhad** — Admin boleh tambah projek baru tanpa bantuan engineer
9. Hasil berulang dan bayaran pendahuluan **direkod secara berasingan** daripada jualan biasa

---

## 7. Keperluan UI/UX

### Skrin yang Diperlukan

| Skrin | Peranan |
|---|---|
| Log Masuk | Semua |
| Dashboard Utama | CEO, Director |
| Paparan Projek (Drill-down) | CEO, Director |
| Entry Jualan | Pengurus Projek |
| Entry Perbelanjaan | Pengurus Projek |
| Kelulusan Perbelanjaan | CEO |
| Sasaran & KPI | CEO |
| Laporan | CEO, Director |
| User Management | Admin |
| Tetapan Sistem (Settings) | Admin, CEO |
| Profil Pengguna | Semua |

### Keperluan Umum UI
- Responsive — berfungsi pada desktop dan tablet (mobile adalah bonus, bukan keutamaan)
- Boleh diakses melalui web browser dari mana-mana
- Bahasa antara muka: Bahasa Malaysia
- Tema warna: mengikut identiti Kop-Pusamaju (TBD — PM akan cadang kepada CEO)

---

## 8. Keperluan Tidak Berfungsi (Non-Functional Requirements)

### Keselamatan
- Login menggunakan username dan kata laluan
- Kata laluan mesti disimpan dalam bentuk hash (tidak boleh plain text)
- Session tamat tempoh selepas tempoh tidak aktif
- Role-based access control pada setiap halaman dan fungsi
- Data diklasifikasikan sebagai **sangat sensitif** — akses mesti dikawal ketat
- Audit trail lengkap — rekod semua perubahan data (siapa, apa, bila)

### Prestasi
- Dashboard mesti dimuatkan dalam masa kurang dari 3 saat
- Sistem mesti boleh handle sekurang-kurangnya 50 pengguna serentak (untuk skala masa depan)

### Scalability
- Projek-agnostic — tiada hardcode nama projek, tambah projek baru tanpa ubah kod
- Pengguna boleh ditambah tanpa had
- Architecture mesti modular — modul baru boleh ditambah tanpa ganggu modul sedia ada
- API-ready — semua fungsi utama boleh diakses melalui API untuk integrasi masa depan
- Bersedia untuk multi-tenancy pada fasa akan datang (walaupun tidak dibina sekarang)

### Ketersediaan
- Sistem mesti boleh diakses dari mana-mana melalui web browser
- Uptime sasaran: 99% (hampir tiada downtime)

---

## 9. Andaian & Batasan

### Andaian
- Semua pengguna mempunyai akses internet dan peranti untuk akses sistem
- CEO dan Admin akan bertanggungjawab untuk setup awal pengguna dan projek
- Data entry dilakukan secara bulanan oleh pengurus projek
- Email adalah kaedah komunikasi utama untuk amaran dan laporan

### Batasan Fasa 1
- Tiada integrasi dengan sistem luar (QuickBooks, SQL, Penggajian)
- Tiada notifikasi WhatsApp
- Tiada AI atau ramalan jualan
- Tiada migrasi data sejarah (data lama dari sistem lama)
- Tiada multi-tenancy

---

## 10. Bahagian Engineer (Perlu Dilengkapkan)

Bahagian berikut perlu diisi oleh Engineer (Iskandar) sebelum pembangunan bermula:

- [ ] **Tech Stack** — Sahkan atau cadangkan alternatif dalam `docs/tech-stack.md`
- [ ] **Data Model** — Reka bentuk struktur database dalam `specs/data-model.md`
- [ ] **API Spec** — Senaraikan semua endpoint yang diperlukan dalam `specs/api-spec.md`
- [ ] **Architecture** — Dokumentasikan keputusan seni bina dalam `docs/architecture.md`
- [ ] **Anggaran masa** — Berikan anggaran masa untuk setiap modul kepada PM

---

## 11. Soalan untuk Engineer

1. Apakah tech stack yang dicadangkan untuk backend dan database?
2. Di manakah sistem akan di-host? (contoh: VPS, cloud — AWS, Google Cloud, Vercel)
3. Bagaimana sistem email alert akan dilaksanakan? (contoh: SendGrid, Nodemailer, SMTP)
4. Bagaimana export PDF dan Excel akan dilaksanakan?
5. Apakah pendekatan untuk authentication? (contoh: JWT, session-based)
6. Berapakah anggaran masa untuk Fasa 1 secara keseluruhan?

---

*Dokumen ini adalah versi 1.0. Sebarang perubahan selepas ini mesti diluluskan oleh PM dan didokumentasikan dalam bahagian changelog di bawah.*

## Changelog

| Versi | Tarikh | Perubahan |
|---|---|---|
| 1.0 | 25 Julai 2026 | Dokumen asal — ditulis oleh PM |
