-- ==============================================================================
-- DEMO DATA SEED — Rekod Jualan (12 bulan), Sasaran KPI, Belanja
-- Jalankan SELEPAS seed.sql (gunakan supabase db reset untuk reset penuh)
--
-- Cara jalankan sahaja fail ini (tanpa reset):
--   psql $DATABASE_URL -f supabase/seed_demo_data.sql
--
-- Guard: Jika rekod jualan sudah wujud, script ini tidak akan jalankan semula.
-- ==============================================================================

DO $$
DECLARE
  v_tenant_id UUID;
  v_ceo_id    UUID := '11111111-1111-1111-1111-111111111111';

  -- Project IDs (10 projek Kop-Pusamaju)
  v_arh UUID; -- Ar-rahnu
  v_psr UUID; -- Pasaraya
  v_fmt UUID; -- Freshmart
  v_hrt UUID; -- Pembangunan Hartanah
  v_kwp UUID; -- Pembiayaan Peribadi
  v_hdw UUID; -- Hardware
  v_pcs UUID; -- Portable Container System
  v_pbl UUID; -- Pembekal Barangan Runcit
  v_ins UUID; -- Insurans
  v_plu UUID; -- Pelancongan dan Umrah

BEGIN
  -- Ambil tenant ID
  SELECT id INTO v_tenant_id FROM tenants WHERE code = 'KOP-PUSAMAJU';
  IF v_tenant_id IS NULL THEN
    RAISE EXCEPTION 'Tenant KOP-PUSAMAJU tidak dijumpai. Jalankan seed.sql dahulu.';
  END IF;

  -- Ambil semua project ID
  SELECT id INTO v_arh FROM projects WHERE tenant_id = v_tenant_id AND code = 'ARH';
  SELECT id INTO v_psr FROM projects WHERE tenant_id = v_tenant_id AND code = 'PSR';
  SELECT id INTO v_fmt FROM projects WHERE tenant_id = v_tenant_id AND code = 'FMT';
  SELECT id INTO v_hrt FROM projects WHERE tenant_id = v_tenant_id AND code = 'HRT';
  SELECT id INTO v_kwp FROM projects WHERE tenant_id = v_tenant_id AND code = 'KWP';
  SELECT id INTO v_hdw FROM projects WHERE tenant_id = v_tenant_id AND code = 'HDW';
  SELECT id INTO v_pcs FROM projects WHERE tenant_id = v_tenant_id AND code = 'PCS';
  SELECT id INTO v_pbl FROM projects WHERE tenant_id = v_tenant_id AND code = 'PBL';
  SELECT id INTO v_ins FROM projects WHERE tenant_id = v_tenant_id AND code = 'INS';
  SELECT id INTO v_plu FROM projects WHERE tenant_id = v_tenant_id AND code = 'PLU';

  -- Guard: jika data jualan sudah wujud, langkau
  IF EXISTS (SELECT 1 FROM sales_entries WHERE tenant_id = v_tenant_id LIMIT 1) THEN
    RAISE NOTICE 'Demo data sudah wujud. Script dilangkau.';
    RETURN;
  END IF;

  -- ============================================================
  -- 1. REKOD JUALAN (Ogos 2025 – Julai 2026)
  --    2 entry/projek/bulan = 240 rekod
  -- ============================================================
  INSERT INTO sales_entries
    (tenant_id, project_id, created_by, sale_date, amount, revenue_type, client_name, product_service_name, payment_method, invoice_ref)
  VALUES

  -- ==========================================================
  -- ARH — Ar-rahnu (Perkhidmatan pajak gadai Islam)
  -- Recurring: faedah/upah simpan bulanan | Regular: transaksi gadaian
  -- ==========================================================
  (v_tenant_id,v_arh,v_ceo_id,'2025-08-08', 22500.00,'recurring','Pelanggan Umum',              'Keuntungan Faedah Ar-rahnu',   'bank_transfer','INV-ARH-202508-001'),
  (v_tenant_id,v_arh,v_ceo_id,'2025-08-22', 14200.00,'regular', 'Pelanggan Umum',   'Bayaran Gadaian Emas',         'cash',         'INV-ARH-202508-002'),
  (v_tenant_id,v_arh,v_ceo_id,'2025-09-10', 23800.00,'recurring','Pelanggan Umum',              'Keuntungan Faedah Ar-rahnu',   'bank_transfer','INV-ARH-202509-001'),
  (v_tenant_id,v_arh,v_ceo_id,'2025-09-25', 15000.00,'regular', 'Pelanggan Umum',   'Caj Upah Simpan Emas',         'cash',         'INV-ARH-202509-002'),
  (v_tenant_id,v_arh,v_ceo_id,'2025-10-07', 21000.00,'recurring','Pelanggan Umum',              'Keuntungan Faedah Ar-rahnu',   'bank_transfer','INV-ARH-202510-001'),
  (v_tenant_id,v_arh,v_ceo_id,'2025-10-23', 13500.00,'regular', 'Pelanggan Umum',   'Bayaran Gadaian Emas',         'cash',         'INV-ARH-202510-002'),
  (v_tenant_id,v_arh,v_ceo_id,'2025-11-05', 24500.00,'recurring','Pelanggan Umum',              'Keuntungan Faedah Ar-rahnu',   'bank_transfer','INV-ARH-202511-001'),
  (v_tenant_id,v_arh,v_ceo_id,'2025-11-20', 16800.00,'regular', 'Pelanggan Umum',   'Caj Upah Simpan Emas',         'cash',         'INV-ARH-202511-002'),
  (v_tenant_id,v_arh,v_ceo_id,'2025-12-08', 26000.00,'recurring','Pelanggan Umum',              'Keuntungan Faedah Ar-rahnu',   'bank_transfer','INV-ARH-202512-001'),
  (v_tenant_id,v_arh,v_ceo_id,'2025-12-22', 18500.00,'regular', 'Pelanggan Umum',   'Bayaran Gadaian Emas',         'cash',         'INV-ARH-202512-002'),
  (v_tenant_id,v_arh,v_ceo_id,'2026-01-09', 25000.00,'recurring','Pelanggan Umum',              'Keuntungan Faedah Ar-rahnu',   'bank_transfer','INV-ARH-202601-001'),
  (v_tenant_id,v_arh,v_ceo_id,'2026-01-24', 17200.00,'regular', 'Pelanggan Umum',   'Caj Upah Simpan Emas',         'cash',         'INV-ARH-202601-002'),
  (v_tenant_id,v_arh,v_ceo_id,'2026-02-06', 27500.00,'recurring','Pelanggan Umum',              'Keuntungan Faedah Ar-rahnu',   'bank_transfer','INV-ARH-202602-001'),
  (v_tenant_id,v_arh,v_ceo_id,'2026-02-21', 19000.00,'regular', 'Pelanggan Umum',   'Bayaran Gadaian Emas',         'cash',         'INV-ARH-202602-002'),
  (v_tenant_id,v_arh,v_ceo_id,'2026-03-05', 24000.00,'recurring','Pelanggan Umum',              'Keuntungan Faedah Ar-rahnu',   'bank_transfer','INV-ARH-202603-001'),
  (v_tenant_id,v_arh,v_ceo_id,'2026-03-20', 16500.00,'regular', 'Pelanggan Umum',   'Caj Upah Simpan Emas',         'cash',         'INV-ARH-202603-002'),
  (v_tenant_id,v_arh,v_ceo_id,'2026-04-08', 28000.00,'recurring','Pelanggan Umum',              'Keuntungan Faedah Ar-rahnu',   'bank_transfer','INV-ARH-202604-001'),
  (v_tenant_id,v_arh,v_ceo_id,'2026-04-23', 20000.00,'regular', 'Pelanggan Umum',   'Bayaran Gadaian Emas',         'cash',         'INV-ARH-202604-002'),
  (v_tenant_id,v_arh,v_ceo_id,'2026-05-07', 29500.00,'recurring','Pelanggan Umum',              'Keuntungan Faedah Ar-rahnu',   'bank_transfer','INV-ARH-202605-001'),
  (v_tenant_id,v_arh,v_ceo_id,'2026-05-22', 21000.00,'regular', 'Pelanggan Umum',   'Caj Upah Simpan Emas',         'cash',         'INV-ARH-202605-002'),
  (v_tenant_id,v_arh,v_ceo_id,'2026-06-05', 27000.00,'recurring','Pelanggan Umum',              'Keuntungan Faedah Ar-rahnu',   'bank_transfer','INV-ARH-202606-001'),
  (v_tenant_id,v_arh,v_ceo_id,'2026-06-20', 19500.00,'regular', 'Pelanggan Umum',   'Bayaran Gadaian Emas',         'cash',         'INV-ARH-202606-002'),
  (v_tenant_id,v_arh,v_ceo_id,'2026-07-07', 31000.00,'recurring','Pelanggan Umum',              'Keuntungan Faedah Ar-rahnu',   'bank_transfer','INV-ARH-202607-001'),
  (v_tenant_id,v_arh,v_ceo_id,'2026-07-22', 22000.00,'regular', 'Pelanggan Umum',   'Caj Upah Simpan Emas',         'cash',         'INV-ARH-202607-002'),

  -- ==========================================================
  -- PSR — Pasaraya (Runcit)
  -- Jualan harian tinggi; puncak Ramadan (Mac) dan Disember
  -- ==========================================================
  (v_tenant_id,v_psr,v_ceo_id,'2025-08-05', 142000.00,'regular','Pelanggan Runcit','Jualan Barangan Runcit',       'card',         'INV-PSR-202508-001'),
  (v_tenant_id,v_psr,v_ceo_id,'2025-08-20', 118000.00,'regular','Pelanggan Runcit','Jualan Produk Harian',         'cash',         'INV-PSR-202508-002'),
  (v_tenant_id,v_psr,v_ceo_id,'2025-09-05', 138000.00,'regular','Pelanggan Runcit','Jualan Barangan Runcit',       'card',         'INV-PSR-202509-001'),
  (v_tenant_id,v_psr,v_ceo_id,'2025-09-20', 122000.00,'regular','Pelanggan Runcit','Jualan Produk Harian',         'cash',         'INV-PSR-202509-002'),
  (v_tenant_id,v_psr,v_ceo_id,'2025-10-06', 155000.00,'regular','Pelanggan Runcit','Jualan Barangan Runcit',       'card',         'INV-PSR-202510-001'),
  (v_tenant_id,v_psr,v_ceo_id,'2025-10-21', 130000.00,'regular','Pelanggan Runcit','Jualan Produk Harian',         'cash',         'INV-PSR-202510-002'),
  (v_tenant_id,v_psr,v_ceo_id,'2025-11-05', 148000.00,'regular','Pelanggan Runcit','Jualan Barangan Runcit',       'card',         'INV-PSR-202511-001'),
  (v_tenant_id,v_psr,v_ceo_id,'2025-11-20', 128000.00,'regular','Pelanggan Runcit','Jualan Produk Harian',         'cash',         'INV-PSR-202511-002'),
  (v_tenant_id,v_psr,v_ceo_id,'2025-12-06', 195000.00,'regular','Pelanggan Runcit','Jualan Barangan Runcit',       'card',         'INV-PSR-202512-001'),
  (v_tenant_id,v_psr,v_ceo_id,'2025-12-21', 175000.00,'regular','Pelanggan Runcit','Jualan Produk Harian',         'cash',         'INV-PSR-202512-002'),
  (v_tenant_id,v_psr,v_ceo_id,'2026-01-07', 140000.00,'regular','Pelanggan Runcit','Jualan Barangan Runcit',       'card',         'INV-PSR-202601-001'),
  (v_tenant_id,v_psr,v_ceo_id,'2026-01-22', 120000.00,'regular','Pelanggan Runcit','Jualan Produk Harian',         'cash',         'INV-PSR-202601-002'),
  (v_tenant_id,v_psr,v_ceo_id,'2026-02-05', 145000.00,'regular','Pelanggan Runcit','Jualan Barangan Runcit',       'card',         'INV-PSR-202602-001'),
  (v_tenant_id,v_psr,v_ceo_id,'2026-02-20', 125000.00,'regular','Pelanggan Runcit','Jualan Produk Harian',         'cash',         'INV-PSR-202602-002'),
  (v_tenant_id,v_psr,v_ceo_id,'2026-03-06', 210000.00,'regular','Pelanggan Runcit','Jualan Barangan Runcit (Ramadan)','card',      'INV-PSR-202603-001'),
  (v_tenant_id,v_psr,v_ceo_id,'2026-03-21', 180000.00,'regular','Pelanggan Runcit','Jualan Produk Harian (Ramadan)','cash',        'INV-PSR-202603-002'),
  (v_tenant_id,v_psr,v_ceo_id,'2026-04-07', 165000.00,'regular','Pelanggan Runcit','Jualan Barangan Runcit',       'card',         'INV-PSR-202604-001'),
  (v_tenant_id,v_psr,v_ceo_id,'2026-04-22', 135000.00,'regular','Pelanggan Runcit','Jualan Produk Harian',         'cash',         'INV-PSR-202604-002'),
  (v_tenant_id,v_psr,v_ceo_id,'2026-05-06', 150000.00,'regular','Pelanggan Runcit','Jualan Barangan Runcit',       'card',         'INV-PSR-202605-001'),
  (v_tenant_id,v_psr,v_ceo_id,'2026-05-21', 128000.00,'regular','Pelanggan Runcit','Jualan Produk Harian',         'cash',         'INV-PSR-202605-002'),
  (v_tenant_id,v_psr,v_ceo_id,'2026-06-06', 155000.00,'regular','Pelanggan Runcit','Jualan Barangan Runcit',       'card',         'INV-PSR-202606-001'),
  (v_tenant_id,v_psr,v_ceo_id,'2026-06-21', 132000.00,'regular','Pelanggan Runcit','Jualan Produk Harian',         'cash',         'INV-PSR-202606-002'),
  (v_tenant_id,v_psr,v_ceo_id,'2026-07-08', 160000.00,'regular','Pelanggan Runcit','Jualan Barangan Runcit',       'card',         'INV-PSR-202607-001'),
  (v_tenant_id,v_psr,v_ceo_id,'2026-07-23', 140000.00,'regular','Pelanggan Runcit','Jualan Produk Harian',         'cash',         'INV-PSR-202607-002'),

  -- ==========================================================
  -- FMT — Freshmart (Produk segar)
  -- ==========================================================
  (v_tenant_id,v_fmt,v_ceo_id,'2025-08-06', 48000.00,'regular','Pelanggan Runcit','Jualan Produk Segar',           'cash',         'INV-FMT-202508-001'),
  (v_tenant_id,v_fmt,v_ceo_id,'2025-08-21', 39000.00,'regular','Pelanggan Runcit','Jualan Sayur dan Buah-buahan',  'cash',         'INV-FMT-202508-002'),
  (v_tenant_id,v_fmt,v_ceo_id,'2025-09-08', 51000.00,'regular','Pelanggan Runcit','Jualan Produk Segar',           'cash',         'INV-FMT-202509-001'),
  (v_tenant_id,v_fmt,v_ceo_id,'2025-09-23', 42000.00,'regular','Pelanggan Runcit','Jualan Sayur dan Buah-buahan',  'cash',         'INV-FMT-202509-002'),
  (v_tenant_id,v_fmt,v_ceo_id,'2025-10-07', 47000.00,'regular','Pelanggan Runcit','Jualan Produk Segar',           'cash',         'INV-FMT-202510-001'),
  (v_tenant_id,v_fmt,v_ceo_id,'2025-10-22', 38000.00,'regular','Pelanggan Runcit','Jualan Sayur dan Buah-buahan',  'cash',         'INV-FMT-202510-002'),
  (v_tenant_id,v_fmt,v_ceo_id,'2025-11-06', 52000.00,'regular','Pelanggan Runcit','Jualan Produk Segar',           'cash',         'INV-FMT-202511-001'),
  (v_tenant_id,v_fmt,v_ceo_id,'2025-11-21', 43000.00,'regular','Pelanggan Runcit','Jualan Sayur dan Buah-buahan',  'cash',         'INV-FMT-202511-002'),
  (v_tenant_id,v_fmt,v_ceo_id,'2025-12-07', 62000.00,'regular','Pelanggan Runcit','Jualan Produk Segar',           'cash',         'INV-FMT-202512-001'),
  (v_tenant_id,v_fmt,v_ceo_id,'2025-12-22', 54000.00,'regular','Pelanggan Runcit','Jualan Sayur dan Buah-buahan',  'cash',         'INV-FMT-202512-002'),
  (v_tenant_id,v_fmt,v_ceo_id,'2026-01-08', 50000.00,'regular','Pelanggan Runcit','Jualan Produk Segar',           'cash',         'INV-FMT-202601-001'),
  (v_tenant_id,v_fmt,v_ceo_id,'2026-01-23', 41000.00,'regular','Pelanggan Runcit','Jualan Sayur dan Buah-buahan',  'cash',         'INV-FMT-202601-002'),
  (v_tenant_id,v_fmt,v_ceo_id,'2026-02-07', 53000.00,'regular','Pelanggan Runcit','Jualan Produk Segar',           'cash',         'INV-FMT-202602-001'),
  (v_tenant_id,v_fmt,v_ceo_id,'2026-02-22', 45000.00,'regular','Pelanggan Runcit','Jualan Sayur dan Buah-buahan',  'cash',         'INV-FMT-202602-002'),
  (v_tenant_id,v_fmt,v_ceo_id,'2026-03-08', 70000.00,'regular','Pelanggan Runcit','Jualan Produk Segar (Ramadan)', 'cash',         'INV-FMT-202603-001'),
  (v_tenant_id,v_fmt,v_ceo_id,'2026-03-23', 61000.00,'regular','Pelanggan Runcit','Jualan Sayur & Buah (Ramadan)', 'cash',         'INV-FMT-202603-002'),
  (v_tenant_id,v_fmt,v_ceo_id,'2026-04-09', 55000.00,'regular','Pelanggan Runcit','Jualan Produk Segar',           'cash',         'INV-FMT-202604-001'),
  (v_tenant_id,v_fmt,v_ceo_id,'2026-04-24', 46000.00,'regular','Pelanggan Runcit','Jualan Sayur dan Buah-buahan',  'cash',         'INV-FMT-202604-002'),
  (v_tenant_id,v_fmt,v_ceo_id,'2026-05-08', 57000.00,'regular','Pelanggan Runcit','Jualan Produk Segar',           'cash',         'INV-FMT-202605-001'),
  (v_tenant_id,v_fmt,v_ceo_id,'2026-05-23', 48000.00,'regular','Pelanggan Runcit','Jualan Sayur dan Buah-buahan',  'cash',         'INV-FMT-202605-002'),
  (v_tenant_id,v_fmt,v_ceo_id,'2026-06-07', 54000.00,'regular','Pelanggan Runcit','Jualan Produk Segar',           'cash',         'INV-FMT-202606-001'),
  (v_tenant_id,v_fmt,v_ceo_id,'2026-06-22', 44000.00,'regular','Pelanggan Runcit','Jualan Sayur dan Buah-buahan',  'cash',         'INV-FMT-202606-002'),
  (v_tenant_id,v_fmt,v_ceo_id,'2026-07-09', 58000.00,'regular','Pelanggan Runcit','Jualan Produk Segar',           'cash',         'INV-FMT-202607-001'),
  (v_tenant_id,v_fmt,v_ceo_id,'2026-07-24', 47000.00,'regular','Pelanggan Runcit','Jualan Sayur dan Buah-buahan',  'cash',         'INV-FMT-202607-002'),

  -- ==========================================================
  -- HRT — Pembangunan Hartanah (Lumpy payments)
  -- advance_deposit = booking unit | regular = bayaran penuh
  -- ==========================================================
  (v_tenant_id,v_hrt,v_ceo_id,'2025-08-12', 150000.00,'advance_deposit','Pembeli Unit A-12','Deposit Pembelian Unit Kediaman','bank_transfer','INV-HRT-202508-001'),
  (v_tenant_id,v_hrt,v_ceo_id,'2025-08-28',  80000.00,'regular',        'Pembeli Unit B-05','Bayaran Akhir Unit Kediaman',    'bank_transfer','INV-HRT-202508-002'),
  (v_tenant_id,v_hrt,v_ceo_id,'2025-09-15', 250000.00,'advance_deposit','Pembeli Unit C-01','Deposit Pembelian Unit Kediaman','bank_transfer','INV-HRT-202509-001'),
  (v_tenant_id,v_hrt,v_ceo_id,'2025-09-29', 120000.00,'regular',        'Pembeli Unit A-08','Bayaran Akhir Unit Kediaman',    'bank_transfer','INV-HRT-202509-002'),
  (v_tenant_id,v_hrt,v_ceo_id,'2025-10-10', 180000.00,'advance_deposit','Syarikat Maju Jaya','Deposit Premis Komersial',      'bank_transfer','INV-HRT-202510-001'),
  (v_tenant_id,v_hrt,v_ceo_id,'2025-10-25',  95000.00,'regular',        'Pembeli Unit D-03','Bayaran Akhir Unit Kediaman',    'bank_transfer','INV-HRT-202510-002'),
  (v_tenant_id,v_hrt,v_ceo_id,'2025-11-08', 320000.00,'advance_deposit','GreenBuild Sdn Bhd','Deposit Pembelian Lot Tanah',   'bank_transfer','INV-HRT-202511-001'),
  (v_tenant_id,v_hrt,v_ceo_id,'2025-11-22', 110000.00,'regular',        'Pembeli Unit E-07','Bayaran Akhir Unit Kediaman',    'bank_transfer','INV-HRT-202511-002'),
  (v_tenant_id,v_hrt,v_ceo_id,'2025-12-09', 200000.00,'advance_deposit','Pembeli Unit F-02','Deposit Pembelian Unit Kediaman','bank_transfer','INV-HRT-202512-001'),
  (v_tenant_id,v_hrt,v_ceo_id,'2025-12-23', 145000.00,'regular',        'Pembeli Unit G-11','Bayaran Akhir Unit Kediaman',    'bank_transfer','INV-HRT-202512-002'),
  (v_tenant_id,v_hrt,v_ceo_id,'2026-01-12', 280000.00,'advance_deposit','Sabah Land Corp',  'Deposit Pembelian Lot Perindustrian','bank_transfer','INV-HRT-202601-001'),
  (v_tenant_id,v_hrt,v_ceo_id,'2026-01-27', 130000.00,'regular',        'Pembeli Unit H-04','Bayaran Akhir Unit Kediaman',    'bank_transfer','INV-HRT-202601-002'),
  (v_tenant_id,v_hrt,v_ceo_id,'2026-02-10', 175000.00,'advance_deposit','Pembeli Unit I-09','Deposit Pembelian Unit Kediaman','bank_transfer','INV-HRT-202602-001'),
  (v_tenant_id,v_hrt,v_ceo_id,'2026-02-25', 100000.00,'regular',        'Pembeli Unit J-06','Bayaran Akhir Unit Kediaman',    'bank_transfer','INV-HRT-202602-002'),
  (v_tenant_id,v_hrt,v_ceo_id,'2026-03-11', 350000.00,'advance_deposit','Borneo Properties','Deposit Pembelian Lot Tanah',    'bank_transfer','INV-HRT-202603-001'),
  (v_tenant_id,v_hrt,v_ceo_id,'2026-03-26', 160000.00,'regular',        'Pembeli Unit K-02','Bayaran Akhir Unit Kediaman',    'bank_transfer','INV-HRT-202603-002'),
  (v_tenant_id,v_hrt,v_ceo_id,'2026-04-10', 220000.00,'advance_deposit','Pembeli Unit L-15','Deposit Pembelian Unit Kediaman','bank_transfer','INV-HRT-202604-001'),
  (v_tenant_id,v_hrt,v_ceo_id,'2026-04-25', 140000.00,'regular',        'Pembeli Unit M-03','Bayaran Akhir Unit Kediaman',    'bank_transfer','INV-HRT-202604-002'),
  (v_tenant_id,v_hrt,v_ceo_id,'2026-05-09', 190000.00,'advance_deposit','Kota Kinabalu Dev','Deposit Premis Komersial',       'bank_transfer','INV-HRT-202605-001'),
  (v_tenant_id,v_hrt,v_ceo_id,'2026-05-24', 125000.00,'regular',        'Pembeli Unit N-08','Bayaran Akhir Unit Kediaman',    'bank_transfer','INV-HRT-202605-002'),
  (v_tenant_id,v_hrt,v_ceo_id,'2026-06-11', 260000.00,'advance_deposit','Pembeli Unit O-01','Deposit Pembelian Unit Kediaman','bank_transfer','INV-HRT-202606-001'),
  (v_tenant_id,v_hrt,v_ceo_id,'2026-06-26', 150000.00,'regular',        'Pembeli Unit P-10','Bayaran Akhir Unit Kediaman',    'bank_transfer','INV-HRT-202606-002'),
  (v_tenant_id,v_hrt,v_ceo_id,'2026-07-10', 300000.00,'advance_deposit','Sabah Maju Corp',  'Deposit Pembelian Lot Tanah',    'bank_transfer','INV-HRT-202607-001'),
  (v_tenant_id,v_hrt,v_ceo_id,'2026-07-25', 170000.00,'regular',        'Pembeli Unit Q-05','Bayaran Akhir Unit Kediaman',    'bank_transfer','INV-HRT-202607-002'),

  -- ==========================================================
  -- KWP — Pembiayaan Peribadi (Pinjaman / pembiayaan mikro)
  -- ==========================================================
  (v_tenant_id,v_kwp,v_ceo_id,'2025-08-07', 52000.00,'recurring','Pelanggan Umum','Bayaran Balik Pembiayaan Peribadi',    'bank_transfer','INV-KWP-202508-001'),
  (v_tenant_id,v_kwp,v_ceo_id,'2025-08-21', 38000.00,'recurring','Pelanggan Umum','Keuntungan Pembiayaan (Yuran Proses)', 'bank_transfer','INV-KWP-202508-002'),
  (v_tenant_id,v_kwp,v_ceo_id,'2025-09-09', 54000.00,'recurring','Pelanggan Umum','Bayaran Balik Pembiayaan Peribadi',    'bank_transfer','INV-KWP-202509-001'),
  (v_tenant_id,v_kwp,v_ceo_id,'2025-09-24', 40000.00,'recurring','Pelanggan Umum','Keuntungan Pembiayaan (Yuran Proses)', 'bank_transfer','INV-KWP-202509-002'),
  (v_tenant_id,v_kwp,v_ceo_id,'2025-10-08', 49000.00,'recurring','Pelanggan Umum','Bayaran Balik Pembiayaan Peribadi',    'bank_transfer','INV-KWP-202510-001'),
  (v_tenant_id,v_kwp,v_ceo_id,'2025-10-23', 36000.00,'recurring','Pelanggan Umum','Keuntungan Pembiayaan (Yuran Proses)', 'bank_transfer','INV-KWP-202510-002'),
  (v_tenant_id,v_kwp,v_ceo_id,'2025-11-07', 57000.00,'recurring','Pelanggan Umum','Bayaran Balik Pembiayaan Peribadi',    'bank_transfer','INV-KWP-202511-001'),
  (v_tenant_id,v_kwp,v_ceo_id,'2025-11-22', 43000.00,'recurring','Pelanggan Umum','Keuntungan Pembiayaan (Yuran Proses)', 'bank_transfer','INV-KWP-202511-002'),
  (v_tenant_id,v_kwp,v_ceo_id,'2025-12-09', 60000.00,'recurring','Pelanggan Umum','Bayaran Balik Pembiayaan Peribadi',    'bank_transfer','INV-KWP-202512-001'),
  (v_tenant_id,v_kwp,v_ceo_id,'2025-12-24', 46000.00,'recurring','Pelanggan Umum','Keuntungan Pembiayaan (Yuran Proses)', 'bank_transfer','INV-KWP-202512-002'),
  (v_tenant_id,v_kwp,v_ceo_id,'2026-01-10', 56000.00,'recurring','Pelanggan Umum','Bayaran Balik Pembiayaan Peribadi',    'bank_transfer','INV-KWP-202601-001'),
  (v_tenant_id,v_kwp,v_ceo_id,'2026-01-25', 41000.00,'recurring','Pelanggan Umum','Keuntungan Pembiayaan (Yuran Proses)', 'bank_transfer','INV-KWP-202601-002'),
  (v_tenant_id,v_kwp,v_ceo_id,'2026-02-09', 59000.00,'recurring','Pelanggan Umum','Bayaran Balik Pembiayaan Peribadi',    'bank_transfer','INV-KWP-202602-001'),
  (v_tenant_id,v_kwp,v_ceo_id,'2026-02-24', 44000.00,'recurring','Pelanggan Umum','Keuntungan Pembiayaan (Yuran Proses)', 'bank_transfer','INV-KWP-202602-002'),
  (v_tenant_id,v_kwp,v_ceo_id,'2026-03-10', 62000.00,'recurring','Pelanggan Umum','Bayaran Balik Pembiayaan Peribadi',    'bank_transfer','INV-KWP-202603-001'),
  (v_tenant_id,v_kwp,v_ceo_id,'2026-03-25', 47000.00,'recurring','Pelanggan Umum','Keuntungan Pembiayaan (Yuran Proses)', 'bank_transfer','INV-KWP-202603-002'),
  (v_tenant_id,v_kwp,v_ceo_id,'2026-04-11', 58000.00,'recurring','Pelanggan Umum','Bayaran Balik Pembiayaan Peribadi',    'bank_transfer','INV-KWP-202604-001'),
  (v_tenant_id,v_kwp,v_ceo_id,'2026-04-26', 43500.00,'recurring','Pelanggan Umum','Keuntungan Pembiayaan (Yuran Proses)', 'bank_transfer','INV-KWP-202604-002'),
  (v_tenant_id,v_kwp,v_ceo_id,'2026-05-10', 63000.00,'recurring','Pelanggan Umum','Bayaran Balik Pembiayaan Peribadi',    'bank_transfer','INV-KWP-202605-001'),
  (v_tenant_id,v_kwp,v_ceo_id,'2026-05-25', 48000.00,'recurring','Pelanggan Umum','Keuntungan Pembiayaan (Yuran Proses)', 'bank_transfer','INV-KWP-202605-002'),
  (v_tenant_id,v_kwp,v_ceo_id,'2026-06-09', 61000.00,'recurring','Pelanggan Umum','Bayaran Balik Pembiayaan Peribadi',    'bank_transfer','INV-KWP-202606-001'),
  (v_tenant_id,v_kwp,v_ceo_id,'2026-06-24', 46000.00,'recurring','Pelanggan Umum','Keuntungan Pembiayaan (Yuran Proses)', 'bank_transfer','INV-KWP-202606-002'),
  (v_tenant_id,v_kwp,v_ceo_id,'2026-07-11', 65000.00,'recurring','Pelanggan Umum','Bayaran Balik Pembiayaan Peribadi',    'bank_transfer','INV-KWP-202607-001'),
  (v_tenant_id,v_kwp,v_ceo_id,'2026-07-26', 50000.00,'recurring','Pelanggan Umum','Keuntungan Pembiayaan (Yuran Proses)', 'bank_transfer','INV-KWP-202607-002'),

  -- ==========================================================
  -- HDW — Hardware (Bahan binaan)
  -- ==========================================================
  (v_tenant_id,v_hdw,v_ceo_id,'2025-08-09', 42000.00,'regular','Pembekal Am',         'Jualan Bahan Binaan',                  'bank_transfer','INV-HDW-202508-001'),
  (v_tenant_id,v_hdw,v_ceo_id,'2025-08-24', 31000.00,'regular','Pelanggan Runcit',    'Jualan Perkakasan dan Alatan',         'cash',         'INV-HDW-202508-002'),
  (v_tenant_id,v_hdw,v_ceo_id,'2025-09-11', 45000.00,'regular','Syarikat Bina Maju',  'Bekalan Bahan Pembinaan (Kontrak)',    'bank_transfer','INV-HDW-202509-001'),
  (v_tenant_id,v_hdw,v_ceo_id,'2025-09-26', 33000.00,'regular','Pelanggan Runcit',    'Jualan Perkakasan dan Alatan',         'cash',         'INV-HDW-202509-002'),
  (v_tenant_id,v_hdw,v_ceo_id,'2025-10-09', 50000.00,'regular','Kontraktor ABC',       'Bekalan Bahan Pembinaan (Kontrak)',    'bank_transfer','INV-HDW-202510-001'),
  (v_tenant_id,v_hdw,v_ceo_id,'2025-10-24', 28000.00,'regular','Pelanggan Runcit',    'Jualan Bahan Binaan',                  'cash',         'INV-HDW-202510-002'),
  (v_tenant_id,v_hdw,v_ceo_id,'2025-11-10', 47000.00,'regular','Syarikat Bina Maju',  'Bekalan Bahan Pembinaan (Kontrak)',    'bank_transfer','INV-HDW-202511-001'),
  (v_tenant_id,v_hdw,v_ceo_id,'2025-11-25', 35000.00,'regular','Pelanggan Runcit',    'Jualan Perkakasan dan Alatan',         'cash',         'INV-HDW-202511-002'),
  (v_tenant_id,v_hdw,v_ceo_id,'2025-12-10', 55000.00,'regular','Kontraktor XYZ',       'Bekalan Bahan Pembinaan (Kontrak)',    'bank_transfer','INV-HDW-202512-001'),
  (v_tenant_id,v_hdw,v_ceo_id,'2025-12-25', 40000.00,'regular','Pelanggan Runcit',    'Jualan Bahan Binaan',                  'cash',         'INV-HDW-202512-002'),
  (v_tenant_id,v_hdw,v_ceo_id,'2026-01-12', 48000.00,'regular','Pembina Jaya Sdn Bhd','Bekalan Bahan Pembinaan (Kontrak)',    'bank_transfer','INV-HDW-202601-001'),
  (v_tenant_id,v_hdw,v_ceo_id,'2026-01-27', 32000.00,'regular','Pelanggan Runcit',    'Jualan Perkakasan dan Alatan',         'cash',         'INV-HDW-202601-002'),
  (v_tenant_id,v_hdw,v_ceo_id,'2026-02-11', 52000.00,'regular','Kontraktor ABC',       'Bekalan Bahan Pembinaan (Kontrak)',    'bank_transfer','INV-HDW-202602-001'),
  (v_tenant_id,v_hdw,v_ceo_id,'2026-02-26', 36000.00,'regular','Pelanggan Runcit',    'Jualan Bahan Binaan',                  'cash',         'INV-HDW-202602-002'),
  (v_tenant_id,v_hdw,v_ceo_id,'2026-03-12', 60000.00,'regular','Borneo Build Corp',   'Bekalan Bahan Pembinaan (Kontrak)',    'bank_transfer','INV-HDW-202603-001'),
  (v_tenant_id,v_hdw,v_ceo_id,'2026-03-27', 42000.00,'regular','Pelanggan Runcit',    'Jualan Perkakasan dan Alatan',         'cash',         'INV-HDW-202603-002'),
  (v_tenant_id,v_hdw,v_ceo_id,'2026-04-12', 54000.00,'regular','Syarikat Bina Maju',  'Bekalan Bahan Pembinaan (Kontrak)',    'bank_transfer','INV-HDW-202604-001'),
  (v_tenant_id,v_hdw,v_ceo_id,'2026-04-27', 38000.00,'regular','Pelanggan Runcit',    'Jualan Bahan Binaan',                  'cash',         'INV-HDW-202604-002'),
  (v_tenant_id,v_hdw,v_ceo_id,'2026-05-11', 57000.00,'regular','Kontraktor XYZ',       'Bekalan Bahan Pembinaan (Kontrak)',    'bank_transfer','INV-HDW-202605-001'),
  (v_tenant_id,v_hdw,v_ceo_id,'2026-05-26', 40000.00,'regular','Pelanggan Runcit',    'Jualan Perkakasan dan Alatan',         'cash',         'INV-HDW-202605-002'),
  (v_tenant_id,v_hdw,v_ceo_id,'2026-06-12', 53000.00,'regular','Pembina Jaya Sdn Bhd','Bekalan Bahan Pembinaan (Kontrak)',    'bank_transfer','INV-HDW-202606-001'),
  (v_tenant_id,v_hdw,v_ceo_id,'2026-06-27', 37000.00,'regular','Pelanggan Runcit',    'Jualan Bahan Binaan',                  'cash',         'INV-HDW-202606-002'),
  (v_tenant_id,v_hdw,v_ceo_id,'2026-07-12', 61000.00,'regular','Borneo Build Corp',   'Bekalan Bahan Pembinaan (Kontrak)',    'bank_transfer','INV-HDW-202607-001'),
  (v_tenant_id,v_hdw,v_ceo_id,'2026-07-27', 43000.00,'regular','Pelanggan Runcit',    'Jualan Perkakasan dan Alatan',         'cash',         'INV-HDW-202607-002'),

  -- ==========================================================
  -- PCS — Portable Container System (Sewaan berulang)
  -- ==========================================================
  (v_tenant_id,v_pcs,v_ceo_id,'2025-08-01', 28000.00,'recurring','Tamu Pekan Nabawan', 'Sewaan Sistem Kontena Bulanan',       'bank_transfer','INV-PCS-202508-001'),
  (v_tenant_id,v_pcs,v_ceo_id,'2025-08-15', 18000.00,'regular',  'Event KK Sabah',    'Perkhidmatan Pemasangan PCS',         'bank_transfer','INV-PCS-202508-002'),
  (v_tenant_id,v_pcs,v_ceo_id,'2025-09-01', 28000.00,'recurring','Tamu Pekan Nabawan', 'Sewaan Sistem Kontena Bulanan',       'bank_transfer','INV-PCS-202509-001'),
  (v_tenant_id,v_pcs,v_ceo_id,'2025-09-18', 15000.00,'regular',  'Majlis Daerah',     'Perkhidmatan Pemasangan PCS',         'bank_transfer','INV-PCS-202509-002'),
  (v_tenant_id,v_pcs,v_ceo_id,'2025-10-01', 30000.00,'recurring','Tamu Pekan Nabawan', 'Sewaan Sistem Kontena Bulanan',       'bank_transfer','INV-PCS-202510-001'),
  (v_tenant_id,v_pcs,v_ceo_id,'2025-10-20', 20000.00,'regular',  'Pesta Kaamatan',    'Perkhidmatan Pemasangan PCS',         'bank_transfer','INV-PCS-202510-002'),
  (v_tenant_id,v_pcs,v_ceo_id,'2025-11-01', 28000.00,'recurring','Tamu Pekan Nabawan', 'Sewaan Sistem Kontena Bulanan',       'bank_transfer','INV-PCS-202511-001'),
  (v_tenant_id,v_pcs,v_ceo_id,'2025-11-16', 16000.00,'regular',  'Majlis Daerah',     'Perkhidmatan Pemasangan PCS',         'bank_transfer','INV-PCS-202511-002'),
  (v_tenant_id,v_pcs,v_ceo_id,'2025-12-01', 30000.00,'recurring','Tamu Pekan Nabawan', 'Sewaan Sistem Kontena Bulanan',       'bank_transfer','INV-PCS-202512-001'),
  (v_tenant_id,v_pcs,v_ceo_id,'2025-12-18', 25000.00,'regular',  'Pesta Akhir Tahun', 'Perkhidmatan Pemasangan PCS',         'bank_transfer','INV-PCS-202512-002'),
  (v_tenant_id,v_pcs,v_ceo_id,'2026-01-01', 28000.00,'recurring','Tamu Pekan Nabawan', 'Sewaan Sistem Kontena Bulanan',       'bank_transfer','INV-PCS-202601-001'),
  (v_tenant_id,v_pcs,v_ceo_id,'2026-01-19', 17000.00,'regular',  'Majlis Daerah',     'Perkhidmatan Pemasangan PCS',         'bank_transfer','INV-PCS-202601-002'),
  (v_tenant_id,v_pcs,v_ceo_id,'2026-02-01', 28000.00,'recurring','Tamu Pekan Nabawan', 'Sewaan Sistem Kontena Bulanan',       'bank_transfer','INV-PCS-202602-001'),
  (v_tenant_id,v_pcs,v_ceo_id,'2026-02-17', 19000.00,'regular',  'Festival Tamu',     'Perkhidmatan Pemasangan PCS',         'bank_transfer','INV-PCS-202602-002'),
  (v_tenant_id,v_pcs,v_ceo_id,'2026-03-01', 30000.00,'recurring','Tamu Pekan Nabawan', 'Sewaan Sistem Kontena Bulanan',       'bank_transfer','INV-PCS-202603-001'),
  (v_tenant_id,v_pcs,v_ceo_id,'2026-03-22', 22000.00,'regular',  'Bazaar Ramadan',    'Perkhidmatan Pemasangan PCS',         'bank_transfer','INV-PCS-202603-002'),
  (v_tenant_id,v_pcs,v_ceo_id,'2026-04-01', 31000.00,'recurring','Tamu Pekan Nabawan', 'Sewaan Sistem Kontena Bulanan',       'bank_transfer','INV-PCS-202604-001'),
  (v_tenant_id,v_pcs,v_ceo_id,'2026-04-18', 21000.00,'regular',  'Pameran Raya',      'Perkhidmatan Pemasangan PCS',         'bank_transfer','INV-PCS-202604-002'),
  (v_tenant_id,v_pcs,v_ceo_id,'2026-05-01', 31000.00,'recurring','Tamu Pekan Nabawan', 'Sewaan Sistem Kontena Bulanan',       'bank_transfer','INV-PCS-202605-001'),
  (v_tenant_id,v_pcs,v_ceo_id,'2026-05-19', 20000.00,'regular',  'Majlis Daerah',     'Perkhidmatan Pemasangan PCS',         'bank_transfer','INV-PCS-202605-002'),
  (v_tenant_id,v_pcs,v_ceo_id,'2026-06-01', 32000.00,'recurring','Tamu Pekan Nabawan', 'Sewaan Sistem Kontena Bulanan',       'bank_transfer','INV-PCS-202606-001'),
  (v_tenant_id,v_pcs,v_ceo_id,'2026-06-20', 22000.00,'regular',  'Festival Borneo',   'Perkhidmatan Pemasangan PCS',         'bank_transfer','INV-PCS-202606-002'),
  (v_tenant_id,v_pcs,v_ceo_id,'2026-07-01', 32000.00,'recurring','Tamu Pekan Nabawan', 'Sewaan Sistem Kontena Bulanan',       'bank_transfer','INV-PCS-202607-001'),
  (v_tenant_id,v_pcs,v_ceo_id,'2026-07-20', 24000.00,'regular',  'Pesta Kaamatan KK', 'Perkhidmatan Pemasangan PCS',         'bank_transfer','INV-PCS-202607-002'),

  -- ==========================================================
  -- PBL — Pembekal Barangan Runcit (Borong B2B)
  -- ==========================================================
  (v_tenant_id,v_pbl,v_ceo_id,'2025-08-08', 88000.00,'regular','Giant Supermarket',    'Bekalan Borong Barangan Runcit',      'bank_transfer','INV-PBL-202508-001'),
  (v_tenant_id,v_pbl,v_ceo_id,'2025-08-23', 72000.00,'regular','Kedai Runcit Tempatan','Penghantaran Stok Bulanan',           'bank_transfer','INV-PBL-202508-002'),
  (v_tenant_id,v_pbl,v_ceo_id,'2025-09-10', 92000.00,'regular','Giant Supermarket',    'Bekalan Borong Barangan Runcit',      'bank_transfer','INV-PBL-202509-001'),
  (v_tenant_id,v_pbl,v_ceo_id,'2025-09-25', 75000.00,'regular','Kedai Runcit Tempatan','Penghantaran Stok Bulanan',           'bank_transfer','INV-PBL-202509-002'),
  (v_tenant_id,v_pbl,v_ceo_id,'2025-10-09', 95000.00,'regular','Aeon Co Sabah',        'Bekalan Borong Barangan Runcit',      'bank_transfer','INV-PBL-202510-001'),
  (v_tenant_id,v_pbl,v_ceo_id,'2025-10-24', 78000.00,'regular','Kedai Runcit Tempatan','Penghantaran Stok Bulanan',           'bank_transfer','INV-PBL-202510-002'),
  (v_tenant_id,v_pbl,v_ceo_id,'2025-11-09', 90000.00,'regular','Giant Supermarket',    'Bekalan Borong Barangan Runcit',      'bank_transfer','INV-PBL-202511-001'),
  (v_tenant_id,v_pbl,v_ceo_id,'2025-11-24', 74000.00,'regular','Kedai Runcit Tempatan','Penghantaran Stok Bulanan',           'bank_transfer','INV-PBL-202511-002'),
  (v_tenant_id,v_pbl,v_ceo_id,'2025-12-09', 115000.00,'regular','Aeon Co Sabah',       'Bekalan Borong Barangan Runcit',      'bank_transfer','INV-PBL-202512-001'),
  (v_tenant_id,v_pbl,v_ceo_id,'2025-12-24',  95000.00,'regular','Kedai Runcit Tempatan','Penghantaran Stok Bulanan',          'bank_transfer','INV-PBL-202512-002'),
  (v_tenant_id,v_pbl,v_ceo_id,'2026-01-10', 85000.00,'regular','Giant Supermarket',    'Bekalan Borong Barangan Runcit',      'bank_transfer','INV-PBL-202601-001'),
  (v_tenant_id,v_pbl,v_ceo_id,'2026-01-25', 70000.00,'regular','Kedai Runcit Tempatan','Penghantaran Stok Bulanan',           'bank_transfer','INV-PBL-202601-002'),
  (v_tenant_id,v_pbl,v_ceo_id,'2026-02-10', 89000.00,'regular','Aeon Co Sabah',        'Bekalan Borong Barangan Runcit',      'bank_transfer','INV-PBL-202602-001'),
  (v_tenant_id,v_pbl,v_ceo_id,'2026-02-25', 73000.00,'regular','Kedai Runcit Tempatan','Penghantaran Stok Bulanan',           'bank_transfer','INV-PBL-202602-002'),
  (v_tenant_id,v_pbl,v_ceo_id,'2026-03-10', 125000.00,'regular','Giant Supermarket',   'Bekalan Borong Barangan Runcit (Ramadan)','bank_transfer','INV-PBL-202603-001'),
  (v_tenant_id,v_pbl,v_ceo_id,'2026-03-25', 100000.00,'regular','Aeon Co Sabah',       'Penghantaran Stok Ramadan',           'bank_transfer','INV-PBL-202603-002'),
  (v_tenant_id,v_pbl,v_ceo_id,'2026-04-10', 98000.00,'regular','Giant Supermarket',    'Bekalan Borong Barangan Runcit',      'bank_transfer','INV-PBL-202604-001'),
  (v_tenant_id,v_pbl,v_ceo_id,'2026-04-25', 80000.00,'regular','Kedai Runcit Tempatan','Penghantaran Stok Bulanan',           'bank_transfer','INV-PBL-202604-002'),
  (v_tenant_id,v_pbl,v_ceo_id,'2026-05-10', 93000.00,'regular','Aeon Co Sabah',        'Bekalan Borong Barangan Runcit',      'bank_transfer','INV-PBL-202605-001'),
  (v_tenant_id,v_pbl,v_ceo_id,'2026-05-25', 76000.00,'regular','Kedai Runcit Tempatan','Penghantaran Stok Bulanan',           'bank_transfer','INV-PBL-202605-002'),
  (v_tenant_id,v_pbl,v_ceo_id,'2026-06-10', 96000.00,'regular','Giant Supermarket',    'Bekalan Borong Barangan Runcit',      'bank_transfer','INV-PBL-202606-001'),
  (v_tenant_id,v_pbl,v_ceo_id,'2026-06-25', 79000.00,'regular','Kedai Runcit Tempatan','Penghantaran Stok Bulanan',           'bank_transfer','INV-PBL-202606-002'),
  (v_tenant_id,v_pbl,v_ceo_id,'2026-07-11', 100000.00,'regular','Aeon Co Sabah',       'Bekalan Borong Barangan Runcit',      'bank_transfer','INV-PBL-202607-001'),
  (v_tenant_id,v_pbl,v_ceo_id,'2026-07-26',  82000.00,'regular','Kedai Runcit Tempatan','Penghantaran Stok Bulanan',          'bank_transfer','INV-PBL-202607-002'),

  -- ==========================================================
  -- INS — Insurans (Takaful / insurans konvensional)
  -- ==========================================================
  (v_tenant_id,v_ins,v_ceo_id,'2025-08-10', 18500.00,'recurring','Pelanggan Umum','Premium Takaful Am (Portfolio)',      'bank_transfer','INV-INS-202508-001'),
  (v_tenant_id,v_ins,v_ceo_id,'2025-08-25', 12000.00,'regular','Pelanggan Runcit','Komisen Ejen Insurans Hayat',         'bank_transfer','INV-INS-202508-002'),
  (v_tenant_id,v_ins,v_ceo_id,'2025-09-10', 19000.00,'recurring','Pelanggan Umum','Premium Takaful Am (Portfolio)',      'bank_transfer','INV-INS-202509-001'),
  (v_tenant_id,v_ins,v_ceo_id,'2025-09-25', 11500.00,'regular','Pelanggan Runcit','Komisen Ejen Insurans Hayat',         'bank_transfer','INV-INS-202509-002'),
  (v_tenant_id,v_ins,v_ceo_id,'2025-10-10', 17500.00,'recurring','Pelanggan Umum','Premium Takaful Am (Portfolio)',      'bank_transfer','INV-INS-202510-001'),
  (v_tenant_id,v_ins,v_ceo_id,'2025-10-25', 13000.00,'regular','Pelanggan Runcit','Komisen Ejen Insurans Hayat',         'bank_transfer','INV-INS-202510-002'),
  (v_tenant_id,v_ins,v_ceo_id,'2025-11-10', 20000.00,'recurring','Pelanggan Umum','Premium Takaful Am (Portfolio)',      'bank_transfer','INV-INS-202511-001'),
  (v_tenant_id,v_ins,v_ceo_id,'2025-11-25', 14000.00,'regular','Pelanggan Runcit','Komisen Ejen Insurans Hayat',         'bank_transfer','INV-INS-202511-002'),
  (v_tenant_id,v_ins,v_ceo_id,'2025-12-10', 22000.00,'recurring','Pelanggan Umum','Premium Takaful Am (Portfolio)',      'bank_transfer','INV-INS-202512-001'),
  (v_tenant_id,v_ins,v_ceo_id,'2025-12-25', 15000.00,'regular','Pelanggan Runcit','Komisen Ejen Insurans Hayat',         'bank_transfer','INV-INS-202512-002'),
  (v_tenant_id,v_ins,v_ceo_id,'2026-01-10', 21000.00,'recurring','Pelanggan Umum','Premium Takaful Am (Portfolio)',      'bank_transfer','INV-INS-202601-001'),
  (v_tenant_id,v_ins,v_ceo_id,'2026-01-25', 14500.00,'regular','Pelanggan Runcit','Komisen Ejen Insurans Hayat',         'bank_transfer','INV-INS-202601-002'),
  (v_tenant_id,v_ins,v_ceo_id,'2026-02-10', 22500.00,'recurring','Pelanggan Umum','Premium Takaful Am (Portfolio)',      'bank_transfer','INV-INS-202602-001'),
  (v_tenant_id,v_ins,v_ceo_id,'2026-02-25', 15500.00,'regular','Pelanggan Runcit','Komisen Ejen Insurans Hayat',         'bank_transfer','INV-INS-202602-002'),
  (v_tenant_id,v_ins,v_ceo_id,'2026-03-10', 24000.00,'recurring','Pelanggan Umum','Premium Takaful Am (Portfolio)',      'bank_transfer','INV-INS-202603-001'),
  (v_tenant_id,v_ins,v_ceo_id,'2026-03-25', 16000.00,'regular','Pelanggan Runcit','Komisen Ejen Insurans Hayat',         'bank_transfer','INV-INS-202603-002'),
  (v_tenant_id,v_ins,v_ceo_id,'2026-04-10', 21500.00,'recurring','Pelanggan Umum','Premium Takaful Am (Portfolio)',      'bank_transfer','INV-INS-202604-001'),
  (v_tenant_id,v_ins,v_ceo_id,'2026-04-25', 14000.00,'regular','Pelanggan Runcit','Komisen Ejen Insurans Hayat',         'bank_transfer','INV-INS-202604-002'),
  (v_tenant_id,v_ins,v_ceo_id,'2026-05-10', 23000.00,'recurring','Pelanggan Umum','Premium Takaful Am (Portfolio)',      'bank_transfer','INV-INS-202605-001'),
  (v_tenant_id,v_ins,v_ceo_id,'2026-05-25', 15000.00,'regular','Pelanggan Runcit','Komisen Ejen Insurans Hayat',         'bank_transfer','INV-INS-202605-002'),
  (v_tenant_id,v_ins,v_ceo_id,'2026-06-10', 22000.00,'recurring','Pelanggan Umum','Premium Takaful Am (Portfolio)',      'bank_transfer','INV-INS-202606-001'),
  (v_tenant_id,v_ins,v_ceo_id,'2026-06-25', 14500.00,'regular','Pelanggan Runcit','Komisen Ejen Insurans Hayat',         'bank_transfer','INV-INS-202606-002'),
  (v_tenant_id,v_ins,v_ceo_id,'2026-07-10', 25000.00,'recurring','Pelanggan Umum','Premium Takaful Am (Portfolio)',      'bank_transfer','INV-INS-202607-001'),
  (v_tenant_id,v_ins,v_ceo_id,'2026-07-25', 16500.00,'regular','Pelanggan Runcit','Komisen Ejen Insurans Hayat',         'bank_transfer','INV-INS-202607-002'),

  -- ==========================================================
  -- PLU — Pelancongan dan Umrah (Musiman: Jan-Mac puncak Umrah)
  -- ==========================================================
  (v_tenant_id,v_plu,v_ceo_id,'2025-08-11', 32000.00,'regular','Jemaah Sabah',        'Pakej Pelancongan Tempatan',          'bank_transfer','INV-PLU-202508-001'),
  (v_tenant_id,v_plu,v_ceo_id,'2025-08-26', 25000.00,'regular','Kumpulan Wisata',     'Pakej Ziarah dan Lawatan',            'bank_transfer','INV-PLU-202508-002'),
  (v_tenant_id,v_plu,v_ceo_id,'2025-09-12', 35000.00,'regular','Jemaah Sabah',        'Pakej Pelancongan Tempatan',          'bank_transfer','INV-PLU-202509-001'),
  (v_tenant_id,v_plu,v_ceo_id,'2025-09-27', 28000.00,'regular','Kumpulan Wisata',     'Pakej Ziarah dan Lawatan',            'bank_transfer','INV-PLU-202509-002'),
  (v_tenant_id,v_plu,v_ceo_id,'2025-10-11', 30000.00,'regular','Jemaah Sabah',        'Pakej Pelancongan Tempatan',          'bank_transfer','INV-PLU-202510-001'),
  (v_tenant_id,v_plu,v_ceo_id,'2025-10-26', 22000.00,'regular','Kumpulan Wisata',     'Pakej Ziarah dan Lawatan',            'bank_transfer','INV-PLU-202510-002'),
  (v_tenant_id,v_plu,v_ceo_id,'2025-11-11', 33000.00,'regular','Jemaah Sabah',        'Pakej Pelancongan Tempatan',          'bank_transfer','INV-PLU-202511-001'),
  (v_tenant_id,v_plu,v_ceo_id,'2025-11-26', 26000.00,'advance_deposit','Jemaah Umrah 2026','Deposit Pakej Umrah 2026',       'bank_transfer','INV-PLU-202511-002'),
  (v_tenant_id,v_plu,v_ceo_id,'2025-12-12', 38000.00,'regular','Jemaah Sabah',        'Pakej Pelancongan Akhir Tahun',       'bank_transfer','INV-PLU-202512-001'),
  (v_tenant_id,v_plu,v_ceo_id,'2025-12-27', 45000.00,'advance_deposit','Jemaah Umrah 2026','Deposit Pakej Umrah 2026',       'bank_transfer','INV-PLU-202512-002'),
  (v_tenant_id,v_plu,v_ceo_id,'2026-01-10', 85000.00,'regular','Jemaah Umrah Jan',    'Pakej Umrah Januari 2026',            'bank_transfer','INV-PLU-202601-001'),
  (v_tenant_id,v_plu,v_ceo_id,'2026-01-25', 72000.00,'regular','Jemaah Umrah Jan',    'Pakej Umrah Januari 2026 (Kumpulan 2)','bank_transfer','INV-PLU-202601-002'),
  (v_tenant_id,v_plu,v_ceo_id,'2026-02-10', 90000.00,'regular','Jemaah Umrah Feb',    'Pakej Umrah Februari 2026',           'bank_transfer','INV-PLU-202602-001'),
  (v_tenant_id,v_plu,v_ceo_id,'2026-02-25', 78000.00,'regular','Jemaah Umrah Feb',    'Pakej Umrah Februari 2026 (Kumpulan 2)','bank_transfer','INV-PLU-202602-002'),
  (v_tenant_id,v_plu,v_ceo_id,'2026-03-10', 95000.00,'regular','Jemaah Umrah Mac',    'Pakej Umrah Mac 2026',                'bank_transfer','INV-PLU-202603-001'),
  (v_tenant_id,v_plu,v_ceo_id,'2026-03-25', 80000.00,'regular','Jemaah Umrah Mac',    'Pakej Umrah Mac 2026 (Kumpulan 2)',   'bank_transfer','INV-PLU-202603-002'),
  (v_tenant_id,v_plu,v_ceo_id,'2026-04-12', 42000.00,'regular','Kumpulan Wisata',     'Pakej Pelancongan Tempatan',          'bank_transfer','INV-PLU-202604-001'),
  (v_tenant_id,v_plu,v_ceo_id,'2026-04-27', 35000.00,'regular','Jemaah Sabah',        'Pakej Ziarah dan Lawatan',            'bank_transfer','INV-PLU-202604-002'),
  (v_tenant_id,v_plu,v_ceo_id,'2026-05-12', 38000.00,'regular','Kumpulan Wisata',     'Pakej Pelancongan Tempatan',          'bank_transfer','INV-PLU-202605-001'),
  (v_tenant_id,v_plu,v_ceo_id,'2026-05-27', 30000.00,'advance_deposit','Jemaah Umrah 2027','Deposit Awal Pakej Umrah 2027',  'bank_transfer','INV-PLU-202605-002'),
  (v_tenant_id,v_plu,v_ceo_id,'2026-06-12', 40000.00,'regular','Kumpulan Wisata',     'Pakej Pelancongan Sabah',             'bank_transfer','INV-PLU-202606-001'),
  (v_tenant_id,v_plu,v_ceo_id,'2026-06-27', 33000.00,'advance_deposit','Jemaah Umrah 2027','Deposit Awal Pakej Umrah 2027',  'bank_transfer','INV-PLU-202606-002'),
  (v_tenant_id,v_plu,v_ceo_id,'2026-07-13', 45000.00,'regular','Kumpulan Wisata',     'Pakej Pelancongan Sabah',             'bank_transfer','INV-PLU-202607-001'),
  (v_tenant_id,v_plu,v_ceo_id,'2026-07-28', 38000.00,'advance_deposit','Jemaah Umrah 2027','Deposit Awal Pakej Umrah 2027',  'bank_transfer','INV-PLU-202607-002');

  -- ============================================================
  -- 2. SASARAN KPI (project_targets) — Julai 2026 untuk semua projek
  -- ============================================================
  INSERT INTO project_targets (tenant_id, project_id, year, month, target_revenue, target_profit_margin, created_by)
  VALUES
    (v_tenant_id, v_arh, 2026, 7,  60000.00, 25.0, v_ceo_id),
    (v_tenant_id, v_psr, 2026, 7, 320000.00, 12.0, v_ceo_id),
    (v_tenant_id, v_fmt, 2026, 7, 115000.00, 10.0, v_ceo_id),
    (v_tenant_id, v_hrt, 2026, 7, 400000.00, 30.0, v_ceo_id),
    (v_tenant_id, v_kwp, 2026, 7, 120000.00, 25.0, v_ceo_id),
    (v_tenant_id, v_hdw, 2026, 7, 110000.00, 15.0, v_ceo_id),
    (v_tenant_id, v_pcs, 2026, 7,  60000.00, 35.0, v_ceo_id),
    (v_tenant_id, v_pbl, 2026, 7, 185000.00,  8.0, v_ceo_id),
    (v_tenant_id, v_ins, 2026, 7,  42000.00, 40.0, v_ceo_id),
    (v_tenant_id, v_plu, 2026, 7,  80000.00, 20.0, v_ceo_id)
  ON CONFLICT (tenant_id, project_id, year, month) DO NOTHING;

  -- ============================================================
  -- 3. BELANJA DILULUSKAN — Julai 2026 (untuk dashboard & laporan)
  -- ============================================================
  INSERT INTO expense_entries
    (tenant_id, project_id, created_by, reviewed_by, expense_date, amount, category, description, status, reviewed_at)
  VALUES
    (v_tenant_id,v_arh,v_ceo_id,v_ceo_id,'2026-07-05',  8500.00,'salaries_wages',        'Gaji Staf Ar-rahnu Julai 2026',           'approved',now()),
    (v_tenant_id,v_arh,v_ceo_id,v_ceo_id,'2026-07-12',  1200.00,'utilities',             'Bil Utiliti Pejabat Ar-rahnu',            'approved',now()),
    (v_tenant_id,v_psr,v_ceo_id,v_ceo_id,'2026-07-05', 85000.00,'supplier_raw_materials','Stok Barangan Runcit Julai 2026',         'approved',now()),
    (v_tenant_id,v_psr,v_ceo_id,v_ceo_id,'2026-07-10', 18000.00,'salaries_wages',        'Gaji Staf Pasaraya Julai 2026',           'approved',now()),
    (v_tenant_id,v_psr,v_ceo_id,v_ceo_id,'2026-07-15',  4500.00,'utilities',             'Bil Elektrik dan Air Pasaraya',           'approved',now()),
    (v_tenant_id,v_fmt,v_ceo_id,v_ceo_id,'2026-07-05', 32000.00,'supplier_raw_materials','Pembelian Produk Segar Julai 2026',       'approved',now()),
    (v_tenant_id,v_fmt,v_ceo_id,v_ceo_id,'2026-07-10',  9000.00,'salaries_wages',        'Gaji Staf Freshmart Julai 2026',          'approved',now()),
    (v_tenant_id,v_hrt,v_ceo_id,v_ceo_id,'2026-07-05', 45000.00,'daily_operations',      'Kos Operasi Projek Pembangunan',          'approved',now()),
    (v_tenant_id,v_hrt,v_ceo_id,v_ceo_id,'2026-07-12', 25000.00,'marketing_advertising', 'Iklan Unit Hartanah Julai 2026',          'approved',now()),
    (v_tenant_id,v_kwp,v_ceo_id,v_ceo_id,'2026-07-05',  7000.00,'salaries_wages',        'Gaji Pegawai Pembiayaan Julai 2026',      'approved',now()),
    (v_tenant_id,v_kwp,v_ceo_id,v_ceo_id,'2026-07-15',  1800.00,'daily_operations',      'Kos Operasi Pejabat KWP',                 'approved',now()),
    (v_tenant_id,v_hdw,v_ceo_id,v_ceo_id,'2026-07-05', 38000.00,'supplier_raw_materials','Stok Bahan Binaan Julai 2026',            'approved',now()),
    (v_tenant_id,v_hdw,v_ceo_id,v_ceo_id,'2026-07-10',  8500.00,'salaries_wages',        'Gaji Staf Hardware Julai 2026',           'approved',now()),
    (v_tenant_id,v_pcs,v_ceo_id,v_ceo_id,'2026-07-05',  5000.00,'daily_operations',      'Kos Penyelenggaraan Kontena Julai 2026',  'approved',now()),
    (v_tenant_id,v_pcs,v_ceo_id,v_ceo_id,'2026-07-12',  4500.00,'salaries_wages',        'Upah Pemasangan PCS Julai 2026',          'approved',now()),
    (v_tenant_id,v_pbl,v_ceo_id,v_ceo_id,'2026-07-05', 68000.00,'supplier_raw_materials','Stok Borong Barangan Runcit Julai 2026',  'approved',now()),
    (v_tenant_id,v_pbl,v_ceo_id,v_ceo_id,'2026-07-10', 12000.00,'salaries_wages',        'Gaji Staf Pembekal Julai 2026',           'approved',now()),
    (v_tenant_id,v_pbl,v_ceo_id,v_ceo_id,'2026-07-18',  5500.00,'travel_transport',      'Kos Penghantaran dan Logistik Julai 2026','approved',now()),
    (v_tenant_id,v_ins,v_ceo_id,v_ceo_id,'2026-07-05',  3500.00,'salaries_wages',        'Gaji Ejen Insurans Julai 2026',           'approved',now()),
    (v_tenant_id,v_ins,v_ceo_id,v_ceo_id,'2026-07-12',   800.00,'daily_operations',      'Kos Operasi Pejabat Insurans',            'approved',now()),
    (v_tenant_id,v_plu,v_ceo_id,v_ceo_id,'2026-07-05', 18000.00,'travel_transport',      'Kos Penerbangan dan Pengangkutan Umrah',  'approved',now()),
    (v_tenant_id,v_plu,v_ceo_id,v_ceo_id,'2026-07-12',  8000.00,'salaries_wages',        'Upah Pemandu Pelancong Julai 2026',       'approved',now()),
    (v_tenant_id,v_plu,v_ceo_id,v_ceo_id,'2026-07-20',  4500.00,'marketing_advertising', 'Promosi Pakej Pelancongan Julai 2026',    'approved',now());

  RAISE NOTICE '✅ Demo data berjaya dimasukkan: 240 rekod jualan, 10 sasaran KPI Julai 2026, 23 rekod belanja diluluskan.';

END $$;
