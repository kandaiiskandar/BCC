-- ==============================================================================
-- DATABASE DEVELOPMENT SEED SCRIPT (Fasa 1 MVP)
-- Initial Tenant, Projects, System Settings, and Test Accounts
-- ==============================================================================

DO $$
DECLARE
  v_tenant_id UUID;
  v_ceo_id UUID := '11111111-1111-1111-1111-111111111111';
  v_pm_id UUID := '22222222-2222-2222-2222-222222222222';
  v_admin_id UUID := '33333333-3333-3333-3333-333333333333';
  v_director_id UUID := '44444444-4444-4444-4444-444444444444';
  v_ar_rahnu_id UUID;
  v_freshmart_id UUID;
  v_pass_hash TEXT;
BEGIN
  -- 1. Create Default Tenant
  INSERT INTO tenants (name, code)
  VALUES ('Koperasi Pembangunan Usahasama Masyarakat Maju Sabah Berhad', 'KOP-PUSAMAJU')
  ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO v_tenant_id;

  -- 2. Create Default System Settings
  INSERT INTO system_settings (tenant_id, warning_threshold_pct, monthly_submission_deadline_day, auto_report_recipients)
  VALUES (v_tenant_id, 80.00, 5, ARRAY['ceo@koperasi.my', 'kewangan@koperasi.my'])
  ON CONFLICT (tenant_id) DO NOTHING;

  -- 3. Populate 10 Active Projects for Kop-Pusamaju
  INSERT INTO projects (tenant_id, name, code, industry, description, is_active)
  VALUES
    (v_tenant_id, 'Ar-rahnu', 'ARH', 'Perkhidmatan kewangan Islam (pajak gadai)', 'Perkhidmatan pajak gadai Syariah', true),
    (v_tenant_id, 'Pasaraya', 'PSR', 'Runcit', 'Operasi pasaraya utama', true),
    (v_tenant_id, 'Freshmart', 'FMT', 'Runcit / Produk segar', 'Kedai barangan segar dan basah', true),
    (v_tenant_id, 'Pembangunan Hartanah', 'HRT', 'Hartanah', 'Projek pembangunan tanah dan hartanah', true),
    (v_tenant_id, 'Pembiayaan Peribadi', 'KWP', 'Kewangan', 'Kemudahan pembiayaan mikro dan peribadi', true),
    (v_tenant_id, 'Hardware', 'HDW', 'Perkakasan / Bahan binaan', 'Kedai bahan binaan dan perkakasan', true),
    (v_tenant_id, 'Portable Container System (PCS)', 'PCS', 'Infrastruktur', 'Sistem kontena boleh alih dan sewaan', true),
    (v_tenant_id, 'Pembekal Barangan Runcit', 'PBL', 'Pembekalan', 'Perkhidmatan pembekalan borong', true),
    (v_tenant_id, 'Insurans', 'INS', 'Insurans', 'Agensi perlindungan insurans dan takaful', true),
    (v_tenant_id, 'Pelancongan dan Umrah', 'PLU', 'Pelancongan', 'Pakej pelancongan tempatan dan pengurusan Umrah', true)
  ON CONFLICT (tenant_id, code) DO NOTHING;

  -- Get specific project IDs for PM assignments
  SELECT id INTO v_ar_rahnu_id FROM projects WHERE tenant_id = v_tenant_id AND code = 'ARH';
  SELECT id INTO v_freshmart_id FROM projects WHERE tenant_id = v_tenant_id AND code = 'FMT';

  -- Generate Bcrypt hash for Password123!
  SELECT crypt('Password123!', gen_salt('bf')) INTO v_pass_hash;

  -- 4. Create Development Test Accounts in auth.users
  -- Default password for all test accounts: Password123!
  -- Set confirmation_token, recovery_token, email_change_token_new, email_change to '' to prevent GoTrue scan errors

  -- CEO User
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    confirmation_token, recovery_token, email_change_token_new, email_change,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    v_ceo_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'ceo@koperasi.my', v_pass_hash, now(),
    '', '', '', '',
    '{"provider":"email","providers":["email"]}', '{"full_name":"Ahmad Fauzi (CEO)","role":"ceo"}', now(), now()
  ) ON CONFLICT (id) DO UPDATE SET
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = EXCLUDED.email_confirmed_at,
    confirmation_token = '',
    recovery_token = '',
    email_change_token_new = '',
    email_change = '';

  -- PM User
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    confirmation_token, recovery_token, email_change_token_new, email_change,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    v_pm_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'pm@koperasi.my', v_pass_hash, now(),
    '', '', '', '',
    '{"provider":"email","providers":["email"]}', '{"full_name":"Siti Sarah (Pengurus Projek)","role":"project_manager"}', now(), now()
  ) ON CONFLICT (id) DO UPDATE SET
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = EXCLUDED.email_confirmed_at,
    confirmation_token = '',
    recovery_token = '',
    email_change_token_new = '',
    email_change = '';

  -- Admin User
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    confirmation_token, recovery_token, email_change_token_new, email_change,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    v_admin_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'admin@koperasi.my', v_pass_hash, now(),
    '', '', '', '',
    '{"provider":"email","providers":["email"]}', '{"full_name":"Khairul (Admin Sistem)","role":"admin"}', now(), now()
  ) ON CONFLICT (id) DO UPDATE SET
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = EXCLUDED.email_confirmed_at,
    confirmation_token = '',
    recovery_token = '',
    email_change_token_new = '',
    email_change = '';

  -- Director User
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    confirmation_token, recovery_token, email_change_token_new, email_change,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    v_director_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'director@koperasi.my', v_pass_hash, now(),
    '', '', '', '',
    '{"provider":"email","providers":["email"]}', '{"full_name":"Rohani Ali (Pengarah)","role":"director"}', now(), now()
  ) ON CONFLICT (id) DO UPDATE SET
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = EXCLUDED.email_confirmed_at,
    confirmation_token = '',
    recovery_token = '',
    email_change_token_new = '',
    email_change = '';

  -- 5. Ensure Profiles match roles for seed accounts
  INSERT INTO public.profiles (id, tenant_id, full_name, email, role, is_active)
  VALUES
    (v_ceo_id, v_tenant_id, 'Ahmad Fauzi (CEO)', 'ceo@koperasi.my', 'ceo', true),
    (v_pm_id, v_tenant_id, 'Siti Sarah (Pengurus Projek)', 'pm@koperasi.my', 'project_manager', true),
    (v_admin_id, v_tenant_id, 'Khairul (Admin Sistem)', 'admin@koperasi.my', 'admin', true),
    (v_director_id, v_tenant_id, 'Rohani Ali (Pengarah)', 'director@koperasi.my', 'director', true)
  ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, full_name = EXCLUDED.full_name;

  -- 6. Assign PM (Siti Sarah) to projects: Ar-rahnu & Freshmart
  IF v_ar_rahnu_id IS NOT NULL THEN
    INSERT INTO user_project_assignments (tenant_id, user_id, project_id)
    VALUES (v_tenant_id, v_pm_id, v_ar_rahnu_id)
    ON CONFLICT (user_id, project_id) DO NOTHING;
  END IF;

  IF v_freshmart_id IS NOT NULL THEN
    INSERT INTO user_project_assignments (tenant_id, user_id, project_id)
    VALUES (v_tenant_id, v_pm_id, v_freshmart_id)
    ON CONFLICT (user_id, project_id) DO NOTHING;
  END IF;

END $$;
