/**
 * SKRIP GOOGLE APPS SCRIPT
 * Soal Selidik CEO - Dashboard Jualan
 *
 * CARA GUNA:
 * 1. Pergi ke https://script.google.com
 * 2. Klik "Projek Baharu" (New Project)
 * 3. Padam semua kod yang ada
 * 4. Salin dan tampal keseluruhan skrip ini
 * 5. Klik butang "Jalankan" (Run) ▶
 * 6. Benarkan kebenaran yang diminta
 * 7. Selepas selesai, pautan Google Form anda akan muncul dalam Log
 *    (Klik: Paparan > Log atau tekan Ctrl+Enter)
 */

function buatFormSoalSelidikCEO() {

  var form = FormApp.create('Soal Selidik Keperluan CEO — Dashboard Jualan');
  form.setDescription(
    'Dokumen ini adalah sebahagian daripada sesi penemuan keperluan untuk projek Dashboard Jualan syarikat. ' +
    'Jawapan anda akan digunakan sebagai keperluan rasmi oleh pasukan produk dan jurutera untuk membina sistem. ' +
    'Sila jawab semua soalan dengan jujur dan terperinci. Terima kasih.'
  );
  form.setCollectEmail(true);
  form.setProgressBar(true);

  // ─── BAHAGIAN A: PERNIAGAAN ───────────────────────────────────────────────

  form.addSectionHeaderItem()
    .setTitle('BAHAGIAN A — Perniagaan')
    .setHelpText('Soalan-soalan ini membantu kami memahami latar belakang syarikat dan sumber pendapatan semasa.');

  form.addParagraphTextItem()
    .setTitle('A1. Apakah nama penuh syarikat dan dalam industri apakah syarikat beroperasi?')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('A2. Berapakah bilangan sumber pendapatan atau projek perniagaan yang syarikat ada pada masa ini? Sila senaraikan nama-namanya.')
    .setHelpText('Contoh: Projek A, Projek B, Perkhidmatan C')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('A3. Adakah semua sumber pendapatan aktif sekarang?')
    .setChoiceValues([
      'Ya, semua aktif',
      'Ada yang bermusim (seasonal)',
      'Ada yang dijeda sementara',
      'Ada yang masih dalam pembangunan',
      'Gabungan beberapa keadaan di atas'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('A4. Syarikat beroperasi dalam berapa negara?')
    .setChoiceValues([
      'Satu negara sahaja (Malaysia)',
      'Beberapa negara',
      'Antarabangsa (lebih 5 negara)'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('A4b. Syarikat berurusan dalam berapa mata wang?')
    .setChoiceValues([
      'Satu mata wang sahaja (MYR)',
      'Dua mata wang (MYR + lain)',
      'Pelbagai mata wang'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('A5. Apakah tahun kewangan syarikat?')
    .setChoiceValues([
      'Januari – Disember',
      'April – Mac',
      'Julai – Jun',
      'Oktober – September'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('A6. Adakah terdapat sistem atau alat sedia ada yang digunakan untuk menjejaki jualan dan perbelanjaan?')
    .setChoiceValues([
      'Tidak ada — semua dilakukan secara manual/lisan',
      'Ya — menggunakan Excel/Google Sheets',
      'Ya — menggunakan perisian perakaunan (contoh: QuickBooks, Xero)',
      'Ya — menggunakan sistem dalaman syarikat'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('A7. Adakah terdapat data sejarah yang perlu dipindahkan ke dalam sistem baharu?')
    .setChoiceValues([
      'Ya, ada data sejarah yang perlu dipindahkan',
      'Tidak, kita mulakan dari awal sahaja',
      'Tidak pasti'
    ])
    .setRequired(true);

  // ─── BAHAGIAN B: ORANG & PERANAN ─────────────────────────────────────────

  form.addPageBreakItem()
    .setTitle('BAHAGIAN B — Orang & Peranan')
    .setHelpText('Soalan-soalan ini membantu kami menentukan siapa yang akan menggunakan sistem dan apakah akses mereka.');

  form.addTextItem()
    .setTitle('B1. Berapakah jumlah pengguna yang akan menggunakan sistem ini (CEO + semua pengurus projek)?')
    .setHelpText('Contoh: 5 orang')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('B2. Sila senaraikan setiap projek dan nama orang yang bertanggungjawab ke atasnya.')
    .setHelpText('Contoh:\nProjek A — Ahmad\nProjek B — Siti\nProjek C — Razif')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('B3. Adakah setiap pengurus projek hanya boleh melihat data projek mereka sendiri?')
    .setChoiceValues([
      'Ya — setiap pengurus hanya boleh lihat projek mereka sendiri',
      'Tidak — pengurus boleh lihat semua projek',
      'Bergantung kepada projek (sesetengah terbuka, sesetengah tertutup)'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('B4. Bolehkah seorang pengurus projek menguruskan lebih daripada satu projek?')
    .setChoiceValues([
      'Ya, boleh',
      'Tidak, satu orang untuk satu projek sahaja'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('B5. Adakah orang lain selain CEO yang perlu melihat gambaran keseluruhan perniagaan?')
    .setChoiceValues([
      'Tidak, CEO sahaja',
      'Ya — CFO / Pengurus Kewangan',
      'Ya — COO / Pengurus Operasi',
      'Ya — Rakan kongsi perniagaan / Pelabur'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('B6. Siapakah yang akan menguruskan akaun pengguna dan tetapan sistem?')
    .setChoiceValues([
      'CEO sendiri',
      'Kakitangan admin yang dilantik',
      'Pasukan IT dalaman',
      'Pengurus Produk / pihak pembangunan'
    ])
    .setRequired(true);

  // ─── BAHAGIAN C: JUALAN & HASIL ──────────────────────────────────────────

  form.addPageBreakItem()
    .setTitle('BAHAGIAN C — Jualan & Hasil')
    .setHelpText('Soalan-soalan ini membantu kami memahami bagaimana hasil perniagaan dicatat dan dikira.');

  form.addMultipleChoiceItem()
    .setTitle('C1. Apakah yang dikira sebagai "jualan" atau "hasil" dalam perniagaan anda?')
    .setChoiceValues([
      'Tunai yang diterima (cash received)',
      'Invois yang dikeluarkan (invoiced)',
      'Kontrak yang ditandatangani (contracted)',
      'Gabungan beberapa kaedah di atas'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('C2. Berapa kerap setiap pengurus projek perlu merekodkan angka jualan mereka?')
    .setChoiceValues([
      'Setiap hari',
      'Setiap minggu',
      'Setiap bulan',
      'Apabila ada jualan sahaja (ad hoc)'
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('C3. Apabila jualan direkodkan, maklumat apakah yang penting untuk direkod? (Pilih semua yang berkenaan)')
    .setChoiceValues([
      'Tarikh jualan',
      'Jumlah hasil (RM)',
      'Nama klien / pelanggan',
      'Jenis produk atau perkhidmatan',
      'Kaedah pembayaran (tunai, pindahan, kad)',
      'Nombor invois / rujukan',
      'Nota tambahan'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('C4. Adakah jualan perlu dipecahkan mengikut jenis produk/perkhidmatan dalam sesebuah projek?')
    .setChoiceValues([
      'Ya — perlukan pecahan terperinci mengikut produk/perkhidmatan',
      'Tidak — jumlah keseluruhan bagi setiap tempoh sudah mencukupi'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('C5. Adakah terdapat hasil berulang (langganan bulanan) yang perlu dijejaki secara berbeza?')
    .setChoiceValues([
      'Ya, ada hasil berulang/langganan',
      'Tidak, semua adalah jualan sekali sahaja',
      'Ada kedua-duanya'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('C6. Adakah mana-mana projek menerima bayaran pendahuluan atau deposit?')
    .setChoiceValues([
      'Ya, dan ia perlu direkodkan secara berasingan',
      'Ya, tetapi boleh digabungkan dengan hasil biasa',
      'Tidak ada bayaran pendahuluan'
    ])
    .setRequired(true);

  // ─── BAHAGIAN D: PERBELANJAAN & KOS ──────────────────────────────────────

  form.addPageBreakItem()
    .setTitle('BAHAGIAN D — Perbelanjaan & Kos')
    .setHelpText('Soalan-soalan ini membantu kami memahami bagaimana perbelanjaan diurus dan dikira dalam setiap projek.');

  form.addMultipleChoiceItem()
    .setTitle('D1. Di manakah perbelanjaan dijejaki?')
    .setChoiceValues([
      'Peringkat projek sahaja',
      'Peringkat syarikat sahaja',
      'Kedua-dua peringkat projek dan syarikat'
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('D2. Apakah jenis perbelanjaan yang paling penting untuk dijejaki? (Pilih semua yang berkenaan)')
    .setChoiceValues([
      'Gaji dan upah kakitangan',
      'Kos pemasaran dan pengiklanan',
      'Kos operasi harian',
      'Kos pembekal / bahan mentah',
      'Sewa premis',
      'Utiliti (elektrik, air, internet)',
      'Komisen jualan',
      'Perjalanan dan pengangkutan',
      'Peralatan dan teknologi'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('D3. Adakah terdapat kos bersama syarikat yang perlu diagihkan kepada projek-projek?')
    .setChoiceValues([
      'Ya',
      'Tidak',
      'Tidak pasti'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('D4. Jika ada kos bersama, bagaimana ia harus diagihkan?')
    .setChoiceValues([
      'Sama rata kepada semua projek',
      'Berkadar berdasarkan hasil setiap projek',
      'Ditetapkan secara manual oleh CEO',
      'Tidak berkenaan'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('D5. Siapakah yang bertanggungjawab memasukkan data perbelanjaan?')
    .setChoiceValues([
      'Pengurus projek masing-masing',
      'Pasukan kewangan / perakaunan',
      'CEO sendiri',
      'Kakitangan admin'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('D6. Adakah perbelanjaan perlu diluluskan sebelum disahkan dalam sistem?')
    .setChoiceValues([
      'Ya — perlukan kelulusan sebelum disahkan',
      'Tidak — terus sahkan apabila dimasukkan',
      'Bergantung kepada jumlah perbelanjaan'
    ])
    .setRequired(true);

  // ─── BAHAGIAN E: SASARAN & PRESTASI ──────────────────────────────────────

  form.addPageBreakItem()
    .setTitle('BAHAGIAN E — Sasaran & Prestasi')
    .setHelpText('Soalan-soalan ini membantu kami memahami bagaimana prestasi projek dan pasukan dinilai.');

  form.addMultipleChoiceItem()
    .setTitle('E1. Adakah anda menetapkan sasaran jualan untuk setiap projek?')
    .setChoiceValues([
      'Ya — sasaran bulanan',
      'Ya — sasaran suku tahunan',
      'Ya — sasaran tahunan',
      'Ya — gabungan beberapa tempoh',
      'Tidak, tiada sasaran ditetapkan buat masa ini'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('E2. Siapakah yang menetapkan sasaran jualan?')
    .setChoiceValues([
      'CEO sahaja',
      'CEO bersama pengurus projek',
      'Pengurus projek sendiri, CEO meluluskan',
      'Pasukan kewangan'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('E3. Apabila sesebuah projek tidak mencapai sasaran, apakah yang anda mahu sistem lakukan?')
    .setChoiceValues([
      'Tunjukkan penunjuk merah / amaran visual sahaja',
      'Hantar amaran emel kepada CEO',
      'Hantar amaran kepada pengurus projek berkenaan',
      'Tiada tindakan automatik — CEO akan semak sendiri'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('E4. Bagaimana anda mentakrifkan "bulan yang baik" untuk perniagaan? Adakah terdapat margin keuntungan minimum atau ambang hasil tertentu?')
    .setHelpText('Contoh: Keuntungan bersih melebihi 20%, atau hasil melebihi RM50,000 sebulan')
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('E5. Adakah anda mahu menjejaki KPI selain hasil dan keuntungan? (Pilih semua yang berkenaan)')
    .setChoiceValues([
      'Bilangan klien baharu',
      'Bilangan transaksi / tawaran yang ditutup',
      'Saiz tawaran purata (average deal size)',
      'Kadar pengekalan pelanggan',
      'Kos pemerolehan pelanggan (CAC)',
      'Margin keuntungan bersih (%)',
      'Pertumbuhan hasil berbanding bulan lepas (%)'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('E6. Adakah dashboard perlu memaparkan skor atau penilaian prestasi bagi setiap pengurus projek?')
    .setChoiceValues([
      'Ya — saya mahu lihat skor prestasi individu',
      'Tidak — data projek sudah mencukupi',
      'Mungkin kemudian, bukan sekarang'
    ])
    .setRequired(true);

  // ─── BAHAGIAN F: DASHBOARD & LAPORAN ─────────────────────────────────────

  form.addPageBreakItem()
    .setTitle('BAHAGIAN F — Dashboard & Laporan')
    .setHelpText('Soalan-soalan ini membantu kami mereka bentuk paparan dashboard dan format laporan yang paling berguna untuk anda.');

  form.addParagraphTextItem()
    .setTitle('F1. Apabila CEO membuka dashboard, apakah angka atau maklumat paling penting yang anda mahu lihat PERTAMA SEKALI?')
    .setHelpText('Contoh: Jumlah hasil bulan ini, Keuntungan bersih setahun, Projek yang paling untung')
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('F2. Apakah tempoh masa yang patut dashboard paparkan? (Pilih semua yang berkenaan)')
    .setChoiceValues([
      'Bulan semasa',
      'Bulan lepas',
      '3 bulan terkini',
      'Suku tahun semasa',
      'Tahun semasa (year-to-date)',
      'Tahun lepas (untuk perbandingan)'
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('F3. Apakah jenis carta atau visual yang paling berguna untuk anda? (Pilih semua yang berkenaan)')
    .setChoiceValues([
      'Carta bar — trend bulanan',
      'Carta pai — bahagian hasil mengikut projek',
      'Carta garis — pertumbuhan dari masa ke masa',
      'Jadual data — senarai angka terperinci',
      'Kad ringkasan — kotak angka besar (KPI cards)',
      'Carta peratusan sasaran — progress bar'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('F4. Adakah CEO perlu boleh klik pada projek dan lihat pecahan terperinci projek tersebut?')
    .setChoiceValues([
      'Ya — perlu ada fungsi drill-down',
      'Tidak — gambaran keseluruhan sudah mencukupi'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('F5. Adakah anda perlu membandingkan tempoh yang sama merentas tahun berbeza?')
    .setHelpText('Contoh: Julai 2025 berbanding Julai 2026')
    .setChoiceValues([
      'Ya — perlu ada perbandingan tahun ke tahun',
      'Tidak perlu buat masa ini'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('F6. Berapa kerap anda menjana laporan rasmi?')
    .setChoiceValues([
      'Setiap akhir bulan',
      'Setiap suku tahun',
      'Setiap akhir tahun',
      'Apabila diperlukan sahaja (ad hoc)'
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('F7. Siapakah yang menerima laporan? (Pilih semua yang berkenaan)')
    .setChoiceValues([
      'CEO sahaja',
      'Pengurus projek masing-masing',
      'Pelabur / lembaga pengarah',
      'Pasukan kewangan',
      'Rakan kongsi perniagaan'
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('F8. Format apakah yang anda mahu laporan dieksport? (Pilih semua yang berkenaan)')
    .setChoiceValues([
      'PDF — untuk dikongsi dan dibentangkan',
      'Excel (.xlsx) — untuk analisis lanjut',
      'Google Sheets — untuk dikongsi dalam talian',
      'Cetakan (print) sahaja'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('F9. Bagaimana laporan harus dijana?')
    .setChoiceValues([
      'Secara automatik pada tarikh tertentu (contoh: 1 haribulan)',
      'CEO minta secara manual apabila diperlukan',
      'Kedua-duanya'
    ])
    .setRequired(true);

  // ─── BAHAGIAN G: PEMBERITAHUAN & AMARAN ──────────────────────────────────

  form.addPageBreakItem()
    .setTitle('BAHAGIAN G — Pemberitahuan & Amaran')
    .setHelpText('Soalan-soalan ini membantu kami menentukan bilakah dan bagaimana sistem perlu memaklumkan anda tentang situasi penting.');

  form.addCheckboxItem()
    .setTitle('G1. Apakah situasi yang anda mahu menerima amaran? (Pilih semua yang berkenaan)')
    .setChoiceValues([
      'Projek tidak menghantar data menjelang tarikh akhir',
      'Hasil jatuh di bawah ambang yang ditetapkan',
      'Perbelanjaan melebihi bajet',
      'Projek melebihi sasaran (amaran positif)',
      'Akaun belum bayar melebihi tempoh tertentu',
      'Laporan bulanan telah sedia untuk semakan'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('G2. Bagaimana anda mahu menerima amaran? (Pilih semua yang berkenaan)')
    .setChoiceValues([
      'Pemberitahuan dalam aplikasi (dalam dashboard)',
      'E-mel',
      'WhatsApp',
      'Telegram',
      'SMS'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('G3. Adakah pengurus projek perlu menerima peringatan automatik untuk menghantar data mereka?')
    .setChoiceValues([
      'Ya — hantar peringatan jika belum hantar menjelang hari tertentu',
      'Tidak perlu — pengurus projek tahu tanggungjawab mereka',
      'Mungkin kemudian, bukan keutamaan sekarang'
    ])
    .setRequired(true);

  // ─── BAHAGIAN H: AKSES & KESELAMATAN ─────────────────────────────────────

  form.addPageBreakItem()
    .setTitle('BAHAGIAN H — Akses & Keselamatan')
    .setHelpText('Soalan-soalan ini membantu kami memastikan sistem selamat dan data perniagaan terlindung.');

  form.addMultipleChoiceItem()
    .setTitle('H1. Bagaimana pengguna harus log masuk ke dalam sistem?')
    .setChoiceValues([
      'Nama pengguna dan kata laluan',
      'Log masuk Google (Google Sign-In)',
      'Pautan e-mel (magic link)',
      'Kaedah mudah — tiada log masuk untuk MVP pertama'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('H2. Adakah terdapat data dalam sistem ini yang sangat sulit?')
    .setChoiceValues([
      'Ya — ada data yang sangat sensitif dan perlu kawalan ketat',
      'Data agak sensitif tetapi kawalan standard sudah mencukupi',
      'Tidak terlalu sensitif — kawalan asas sudah cukup'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('H3. Jika pengurus projek meninggalkan syarikat, apakah yang harus berlaku pada data mereka?')
    .setChoiceValues([
      'Data kekal dalam sistem, akaun dinyahaktifkan',
      'Data dipindahkan kepada pengurus projek baharu',
      'Data diarkibkan dan disimpan',
      'Data dipadamkan sepenuhnya'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('H4. Adakah sistem perlu menyimpan jejak audit (siapa ubah apa, dan bila)?')
    .setChoiceValues([
      'Ya — sangat penting untuk akauntabiliti',
      'Mungkin berguna tetapi bukan keutamaan',
      'Tidak perlu'
    ])
    .setRequired(true);

  // ─── BAHAGIAN I: TEKNIKAL & OPERASI ──────────────────────────────────────

  form.addPageBreakItem()
    .setTitle('BAHAGIAN I — Teknikal & Operasi')
    .setHelpText('Soalan-soalan ini membantu pasukan jurutera merancang pembangunan teknikal sistem.');

  form.addMultipleChoiceItem()
    .setTitle('I1. Di manakah anda mahu sistem ini boleh diakses?')
    .setChoiceValues([
      'Komputer pejabat sahaja (LAN dalaman)',
      'Dari mana-mana melalui pelayar internet',
      'Aplikasi mudah alih (apps)',
      'Tidak pasti — terbuka kepada cadangan'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('I2. Adakah sistem perlu berfungsi pada telefon bimbit atau tablet?')
    .setChoiceValues([
      'Ya — sangat penting, pengguna kerap guna telefon',
      'Bagus jika ada, tetapi bukan keutamaan',
      'Tidak perlu — komputer meja/laptop sudah mencukupi'
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('I3. Adakah terdapat perisian sedia ada yang sistem perlu disambungkan? (Pilih semua yang berkenaan)')
    .setChoiceValues([
      'Perisian perakaunan (QuickBooks, Xero, SQL Accounting)',
      'CRM (Salesforce, HubSpot)',
      'Sistem penggajian',
      'Suapan bank (bank feed)',
      'Google Workspace (Sheets, Drive)',
      'Microsoft 365 (Excel, SharePoint)',
      'Tiada integrasi diperlukan buat masa ini'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('I4. Bagaimana sistem akan diurus selepas siap?')
    .setChoiceValues([
      'Pasukan IT dalaman syarikat',
      'Pihak pembangun (outsource)',
      'Sistem berdiri sendiri — tiada penyelenggaraan diperlukan',
      'Tidak pasti'
    ])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('I5. Bilakah anda memerlukan versi pertama sistem yang berfungsi?')
    .setHelpText('Contoh: Dalam masa 1 bulan, sebelum akhir suku tahun ini, tidak tergesa-gesa')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('I6. Adakah terdapat belanjawan yang diperuntukkan untuk projek pembangunan ini?')
    .setChoiceValues([
      'Ya, ada belanjawan yang ditetapkan',
      'Fleksibel — bergantung kepada skop',
      'Belanjawan terhad — perlu kos rendah',
      'Belum ditentukan'
    ])
    .setRequired(true);

  // ─── BAHAGIAN J: PANDANGAN MASA DEPAN ────────────────────────────────────

  form.addPageBreakItem()
    .setTitle('BAHAGIAN J — Pandangan Masa Depan')
    .setHelpText('Soalan-soalan terakhir ini membantu kami merancang sistem yang boleh berkembang bersama perniagaan anda.');

  form.addParagraphTextItem()
    .setTitle('J1. Dalam 12 bulan, bagaimana anda menjangkakan sistem ini akan digunakan secara berbeza daripada hari ini?')
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('J2. Adakah ciri-ciri berikut yang mungkin anda inginkan pada masa hadapan? (Pilih semua yang berkenaan)')
    .setChoiceValues([
      'Ramalan jualan (AI/ML forecasting)',
      'Pandangan dan cadangan AI',
      'Portal klien (pelanggan boleh log masuk)',
      'Integrasi penggajian automatik',
      'Sistem sebut harga dan invois',
      'Penjejakan projek (project tracking)',
      'Analitik lanjutan dan laporan tersuai'
    ])
    .showOtherOption(true)
    .setRequired(false);

  form.addMultipleChoiceItem()
    .setTitle('J3. Adakah kemungkinan pasukan berkembang dan lebih ramai orang memerlukan akses kepada sistem?')
    .setChoiceValues([
      'Ya — syarikat sedang berkembang pesat',
      'Mungkin dalam masa 1-2 tahun',
      'Tidak — saiz pasukan akan kekal sama'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('J4. Adakah anda pernah mahu menunjukkan bahagian dashboard ini kepada pihak luar?')
    .setChoiceValues([
      'Ya — kepada pelabur atau lembaga pengarah',
      'Ya — kepada bank atau institusi kewangan',
      'Ya — kepada rakan kongsi perniagaan',
      'Tidak — maklumat ini dalaman sahaja'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Adakah terdapat sebarang keperluan, cadangan, atau kebimbangan lain yang ingin anda kongsikan?')
    .setHelpText('Ruangan terbuka untuk sebarang maklumat tambahan yang anda rasa penting.')
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle('Keperluan Lain — Adakah terdapat sebarang ciri, fungsi, atau keperluan khas yang anda inginkan dalam sistem ini yang tidak disebutkan dalam soalan-soalan di atas?')
    .setHelpText('Contoh: Integrasi dengan sistem tertentu, paparan khas untuk mesyuarat lembaga, fungsi unik untuk industri anda, atau apa-apa sahaja yang anda rasa sistem ini perlu ada.')
    .setRequired(false);

  // ─── LOG URL FORM ─────────────────────────────────────────────────────────

  var url = form.getPublishedUrl();
  var editUrl = form.getEditUrl();

  Logger.log('✅ Google Form berjaya dibuat!');
  Logger.log('📋 Pautan untuk CEO mengisi borang: ' + url);
  Logger.log('✏️  Pautan untuk mengedit borang: ' + editUrl);
}
