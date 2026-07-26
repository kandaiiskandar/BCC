-- ==============================================================================
-- DATABASE INITIAL SCHEMA MIGRATION (Fasa 1 MVP)
-- Business Command Centre — Kop-Pusamaju
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. DATABASE CUSTOM ENUM TYPES
-- ------------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM (
  'super_admin',
  'ceo',
  'director',
  'project_manager',
  'admin'
);

CREATE TYPE revenue_type AS ENUM (
  'regular',
  'recurring',
  'advance_deposit'
);

CREATE TYPE payment_method AS ENUM (
  'cash',
  'bank_transfer',
  'card'
);

CREATE TYPE expense_category AS ENUM (
  'salaries_wages',
  'marketing_advertising',
  'daily_operations',
  'supplier_raw_materials',
  'rent',
  'utilities',
  'sales_commission',
  'travel_transport',
  'equipment_tech',
  'others'
);

CREATE TYPE expense_status AS ENUM (
  'pending',
  'approved',
  'rejected'
);

CREATE TYPE allocation_method AS ENUM (
  'manual',
  'proportional_by_revenue'
);

-- ------------------------------------------------------------------------------
-- 2. RELATIONAL TABLE DEFINITIONS
-- ------------------------------------------------------------------------------

-- Tenants (Multi-tenancy foundation)
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Profiles (Linked to auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'project_manager',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL,
  industry VARCHAR(100) NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, code)
);

-- User Project Assignments (Junction Table)
CREATE TABLE user_project_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, project_id)
);

-- Sales Entries
CREATE TABLE sales_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  sale_date DATE NOT NULL,
  amount DECIMAL(15, 2) NOT NULL CHECK (amount >= 0),
  revenue_type revenue_type NOT NULL DEFAULT 'regular',
  client_name VARCHAR(255) NOT NULL,
  product_service_name VARCHAR(255) NOT NULL,
  payment_method payment_method NOT NULL DEFAULT 'bank_transfer',
  invoice_ref VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Expense Entries
CREATE TABLE expense_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  expense_date DATE NOT NULL,
  category expense_category NOT NULL,
  amount DECIMAL(15, 2) NOT NULL CHECK (amount >= 0),
  description TEXT NOT NULL,
  receipt_url TEXT,
  status expense_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_rejection_reason CHECK (
    (status = 'rejected' AND rejection_reason IS NOT NULL AND rejection_reason <> '') OR
    (status <> 'rejected')
  )
);

-- Shared Expenses (Corporate Overhead)
CREATE TABLE shared_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL CHECK (amount >= 0),
  expense_date DATE NOT NULL,
  allocation_method allocation_method NOT NULL DEFAULT 'proportional_by_revenue',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Shared Expense Allocations
CREATE TABLE shared_expense_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  shared_expense_id UUID NOT NULL REFERENCES shared_expenses(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  allocated_amount DECIMAL(15, 2) NOT NULL CHECK (allocated_amount >= 0),
  allocation_percentage DECIMAL(5, 2) NOT NULL CHECK (allocation_percentage BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (shared_expense_id, project_id)
);

-- Project Targets (Monthly Goals)
CREATE TABLE project_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  year INT NOT NULL CHECK (year >= 2020),
  month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
  target_revenue DECIMAL(15, 2) NOT NULL DEFAULT 0 CHECK (target_revenue >= 0),
  target_profit_margin DECIMAL(5, 2) NOT NULL DEFAULT 0 CHECK (target_profit_margin BETWEEN 0 AND 100),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, project_id, year, month)
);

-- System Settings
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID UNIQUE NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  warning_threshold_pct DECIMAL(5, 2) NOT NULL DEFAULT 80.00 CHECK (warning_threshold_pct BETWEEN 0 AND 100),
  monthly_submission_deadline_day INT NOT NULL DEFAULT 5 CHECK (monthly_submission_deadline_day BETWEEN 1 AND 28),
  auto_report_recipients TEXT[] NOT NULL DEFAULT '{}',
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  table_name VARCHAR(100) NOT NULL,
  record_id UUID NOT NULL,
  action VARCHAR(10) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data JSONB,
  new_data JSONB,
  changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 3. PERFORMANCE INDEXES
-- ------------------------------------------------------------------------------
CREATE INDEX idx_profiles_tenant_role ON profiles(tenant_id, role);
CREATE INDEX idx_projects_tenant_active ON projects(tenant_id, is_active);
CREATE INDEX idx_assignments_user_project ON user_project_assignments(user_id, project_id);
CREATE INDEX idx_assignments_project ON user_project_assignments(project_id);
CREATE INDEX idx_sales_tenant_project_date ON sales_entries(tenant_id, project_id, sale_date);
CREATE INDEX idx_expenses_tenant_project_date ON expense_entries(tenant_id, project_id, expense_date);
CREATE INDEX idx_expenses_status ON expense_entries(status);
CREATE INDEX idx_targets_project_year_month ON project_targets(project_id, year, month);
CREATE INDEX idx_shared_allocations_project ON shared_expense_allocations(project_id);
CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ------------------------------------------------------------------------------
-- 4. DATABASE FUNCTIONS AND TRIGGERS
-- ------------------------------------------------------------------------------

-- Automatic updated_at timestamp trigger
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_tenants BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at_profiles BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at_projects BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at_sales BEFORE UPDATE ON sales_entries FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at_expenses BEFORE UPDATE ON expense_entries FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at_shared BEFORE UPDATE ON shared_expenses FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at_targets BEFORE UPDATE ON project_targets FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at_settings BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- Auto Profile creation on Supabase Auth user registration
-- SET search_path = public makes custom types (user_role) and tables visible during trigger execution
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_default_tenant_id UUID;
  v_role user_role;
  v_full_name VARCHAR;
BEGIN
  SELECT id INTO v_default_tenant_id FROM tenants ORDER BY created_at ASC LIMIT 1;
  IF v_default_tenant_id IS NULL THEN
    INSERT INTO tenants (name, code)
    VALUES ('Koperasi Pembangunan Usahasama Masyarakat Maju Sabah Berhad', 'KOP-PUSAMAJU')
    RETURNING id INTO v_default_tenant_id;
  END IF;

  v_role := COALESCE((new.raw_user_meta_data->>'role')::user_role, 'project_manager');
  v_full_name := COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));

  INSERT INTO public.profiles (id, tenant_id, full_name, email, role, is_active)
  VALUES (
    new.id,
    v_default_tenant_id,
    v_full_name,
    new.email,
    v_role,
    true
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Audit Trail Trigger Function
CREATE OR REPLACE FUNCTION audit_trail_trigger_func()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  v_tenant_id UUID;
BEGIN
  v_user_id := auth.uid();

  IF (TG_OP = 'DELETE') THEN
    v_tenant_id := OLD.tenant_id;
    INSERT INTO audit_logs (tenant_id, table_name, record_id, action, old_data, changed_by)
    VALUES (v_tenant_id, TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD), v_user_id);
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE') THEN
    v_tenant_id := NEW.tenant_id;
    IF to_jsonb(OLD) <> to_jsonb(NEW) THEN
      INSERT INTO audit_logs (tenant_id, table_name, record_id, action, old_data, new_data, changed_by)
      VALUES (v_tenant_id, TG_TABLE_NAME, NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), v_user_id);
    END IF;
    RETURN NEW;
  ELSIF (TG_OP = 'INSERT') THEN
    v_tenant_id := NEW.tenant_id;
    INSERT INTO audit_logs (tenant_id, table_name, record_id, action, new_data, changed_by)
    VALUES (v_tenant_id, TG_TABLE_NAME, NEW.id, 'INSERT', to_jsonb(NEW), v_user_id);
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER audit_sales AFTER INSERT OR UPDATE OR DELETE ON sales_entries FOR EACH ROW EXECUTE FUNCTION audit_trail_trigger_func();
CREATE TRIGGER audit_expenses AFTER INSERT OR UPDATE OR DELETE ON expense_entries FOR EACH ROW EXECUTE FUNCTION audit_trail_trigger_func();
CREATE TRIGGER audit_projects AFTER INSERT OR UPDATE OR DELETE ON projects FOR EACH ROW EXECUTE FUNCTION audit_trail_trigger_func();
CREATE TRIGGER audit_targets AFTER INSERT OR UPDATE OR DELETE ON project_targets FOR EACH ROW EXECUTE FUNCTION audit_trail_trigger_func();

-- ------------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_project_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_expense_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS
CREATE OR REPLACE FUNCTION get_current_user_profile()
RETURNS TABLE (tenant_id UUID, role user_role) AS $$
  SELECT tenant_id, role
  FROM public.profiles
  WHERE id = auth.uid() AND is_active = true;
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION is_assigned_to_project(p_project_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_project_assignments
    WHERE user_id = auth.uid() AND project_id = p_project_id
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- Policies for profiles (Self-read first prevents RLS recursion)
CREATE POLICY "Profiles readable by self or tenant members" ON profiles FOR SELECT
  USING (
    id = auth.uid() OR
    tenant_id = (SELECT tenant_id FROM get_current_user_profile())
  );

CREATE POLICY "Profiles manageable by admin" ON profiles FOR ALL
  USING (
    (SELECT role FROM get_current_user_profile()) IN ('super_admin', 'admin') OR
    id = auth.uid()
  );

-- Policies for projects
CREATE POLICY "Projects readable by tenant or assigned PM" ON projects FOR SELECT
  USING (
    tenant_id = (SELECT tenant_id FROM get_current_user_profile()) AND (
      (SELECT role FROM get_current_user_profile()) IN ('super_admin', 'ceo', 'director', 'admin') OR
      is_assigned_to_project(id)
    )
  );

CREATE POLICY "Projects writable by admin" ON projects FOR ALL
  USING (
    tenant_id = (SELECT tenant_id FROM get_current_user_profile()) AND
    (SELECT role FROM get_current_user_profile()) IN ('super_admin', 'admin')
  );

-- Policies for assignments
CREATE POLICY "Assignments readable by tenant" ON user_project_assignments FOR SELECT
  USING (tenant_id = (SELECT tenant_id FROM get_current_user_profile()));

CREATE POLICY "Assignments writable by admin" ON user_project_assignments FOR ALL
  USING (
    tenant_id = (SELECT tenant_id FROM get_current_user_profile()) AND
    (SELECT role FROM get_current_user_profile()) IN ('super_admin', 'admin')
  );

-- Policies for sales_entries
CREATE POLICY "Sales readable by tenant or assigned PM" ON sales_entries FOR SELECT
  USING (
    tenant_id = (SELECT tenant_id FROM get_current_user_profile()) AND (
      (SELECT role FROM get_current_user_profile()) IN ('super_admin', 'ceo', 'director') OR
      is_assigned_to_project(project_id)
    )
  );

CREATE POLICY "Sales write permission" ON sales_entries FOR INSERT
  WITH CHECK (
    tenant_id = (SELECT tenant_id FROM get_current_user_profile()) AND (
      (SELECT role FROM get_current_user_profile()) IN ('super_admin', 'ceo') OR
      (
        (SELECT role FROM get_current_user_profile()) = 'project_manager' AND
        is_assigned_to_project(project_id)
      )
    )
  );

CREATE POLICY "Sales update permission" ON sales_entries FOR UPDATE
  USING (
    tenant_id = (SELECT tenant_id FROM get_current_user_profile()) AND (
      (SELECT role FROM get_current_user_profile()) IN ('super_admin', 'ceo') OR
      (
        (SELECT role FROM get_current_user_profile()) = 'project_manager' AND
        is_assigned_to_project(project_id)
      )
    )
  );

CREATE POLICY "Sales delete permission" ON sales_entries FOR DELETE
  USING (
    tenant_id = (SELECT tenant_id FROM get_current_user_profile()) AND
    (SELECT role FROM get_current_user_profile()) IN ('super_admin', 'ceo')
  );

-- Policies for expense_entries
CREATE POLICY "Expenses readable by tenant or assigned PM" ON expense_entries FOR SELECT
  USING (
    tenant_id = (SELECT tenant_id FROM get_current_user_profile()) AND (
      (SELECT role FROM get_current_user_profile()) IN ('super_admin', 'ceo', 'director') OR
      is_assigned_to_project(project_id)
    )
  );

CREATE POLICY "Expenses insert permission" ON expense_entries FOR INSERT
  WITH CHECK (
    tenant_id = (SELECT tenant_id FROM get_current_user_profile()) AND (
      (SELECT role FROM get_current_user_profile()) IN ('super_admin', 'ceo') OR
      (
        (SELECT role FROM get_current_user_profile()) = 'project_manager' AND
        is_assigned_to_project(project_id) AND
        status = 'pending'
      )
    )
  );

CREATE POLICY "Expenses update permission" ON expense_entries FOR UPDATE
  USING (
    tenant_id = (SELECT tenant_id FROM get_current_user_profile()) AND (
      (SELECT role FROM get_current_user_profile()) IN ('super_admin', 'ceo') OR
      (
        (SELECT role FROM get_current_user_profile()) = 'project_manager' AND
        is_assigned_to_project(project_id) AND
        status = 'pending'
      )
    )
  );

CREATE POLICY "Expenses delete permission" ON expense_entries FOR DELETE
  USING (
    tenant_id = (SELECT tenant_id FROM get_current_user_profile()) AND
    (SELECT role FROM get_current_user_profile()) IN ('super_admin', 'ceo')
  );

-- Policies for shared_expenses & allocations
CREATE POLICY "Shared expenses readable by tenant" ON shared_expenses FOR SELECT
  USING (tenant_id = (SELECT tenant_id FROM get_current_user_profile()));

CREATE POLICY "Shared expenses writable by CEO" ON shared_expenses FOR ALL
  USING (
    tenant_id = (SELECT tenant_id FROM get_current_user_profile()) AND
    (SELECT role FROM get_current_user_profile()) IN ('super_admin', 'ceo')
  );

-- Policies for project_targets
CREATE POLICY "Targets readable by tenant" ON project_targets FOR SELECT
  USING (tenant_id = (SELECT tenant_id FROM get_current_user_profile()));

CREATE POLICY "Targets writable by CEO" ON project_targets FOR ALL
  USING (
    tenant_id = (SELECT tenant_id FROM get_current_user_profile()) AND
    (SELECT role FROM get_current_user_profile()) IN ('super_admin', 'ceo')
  );

-- Policies for system_settings
CREATE POLICY "Settings readable by tenant" ON system_settings FOR SELECT
  USING (tenant_id = (SELECT tenant_id FROM get_current_user_profile()));

CREATE POLICY "Settings writable by admin" ON system_settings FOR ALL
  USING (
    tenant_id = (SELECT tenant_id FROM get_current_user_profile()) AND
    (SELECT role FROM get_current_user_profile()) IN ('super_admin', 'ceo', 'admin')
  );

-- Policies for audit_logs
CREATE POLICY "Audit logs readable by admin/CEO" ON audit_logs FOR SELECT
  USING (
    tenant_id = (SELECT tenant_id FROM get_current_user_profile()) AND
    (SELECT role FROM get_current_user_profile()) IN ('super_admin', 'ceo', 'admin')
  );
