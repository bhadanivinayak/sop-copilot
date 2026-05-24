-- Fix: company_isolation policy blocked INSERT for new users (no company yet)
-- Split FOR ALL into separate per-operation policies

DROP POLICY IF EXISTS "company_isolation" ON companies;

-- Authenticated users can create a new company
CREATE POLICY "company_insert" ON companies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can only read their own company
CREATE POLICY "company_select" ON companies
  FOR SELECT USING (id = get_user_company_id());

-- Users can only update their own company
CREATE POLICY "company_update" ON companies
  FOR UPDATE USING (id = get_user_company_id());

-- Users can only delete their own company
CREATE POLICY "company_delete" ON companies
  FOR DELETE USING (id = get_user_company_id());
