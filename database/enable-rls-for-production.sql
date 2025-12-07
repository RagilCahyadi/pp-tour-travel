-- =====================================================
-- RLS POLICIES FOR PRODUCTION
-- =====================================================
-- Use this when deploying to production
-- These policies allow authenticated users to access data
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE cancellation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- BOOKINGS POLICIES
-- =====================================================

-- Allow authenticated users to read all bookings
CREATE POLICY "Allow authenticated users to read bookings"
ON bookings FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert bookings
CREATE POLICY "Allow authenticated users to insert bookings"
ON bookings FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update bookings
CREATE POLICY "Allow authenticated users to update bookings"
ON bookings FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete bookings
CREATE POLICY "Allow authenticated users to delete bookings"
ON bookings FOR DELETE
TO authenticated
USING (true);

-- =====================================================
-- CUSTOMERS POLICIES
-- =====================================================

CREATE POLICY "Allow authenticated users to read customers"
ON customers FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert customers"
ON customers FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update customers"
ON customers FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete customers"
ON customers FOR DELETE
TO authenticated
USING (true);

-- =====================================================
-- TOUR PACKAGES POLICIES
-- =====================================================

CREATE POLICY "Allow authenticated users to read tour_packages"
ON tour_packages FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert tour_packages"
ON tour_packages FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update tour_packages"
ON tour_packages FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete tour_packages"
ON tour_packages FOR DELETE
TO authenticated
USING (true);

-- =====================================================
-- PAYMENTS POLICIES
-- =====================================================

CREATE POLICY "Allow authenticated users to read payments"
ON payments FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert payments"
ON payments FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update payments"
ON payments FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete payments"
ON payments FOR DELETE
TO authenticated
USING (true);

-- =====================================================
-- SCHEDULES POLICIES
-- =====================================================

CREATE POLICY "Allow authenticated users to read schedules"
ON schedules FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert schedules"
ON schedules FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update schedules"
ON schedules FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete schedules"
ON schedules FOR DELETE
TO authenticated
USING (true);

-- =====================================================
-- CANCELLATION REQUESTS POLICIES
-- =====================================================

CREATE POLICY "Allow authenticated users to read cancellation_requests"
ON cancellation_requests FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert cancellation_requests"
ON cancellation_requests FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update cancellation_requests"
ON cancellation_requests FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- =====================================================
-- ADMIN PROFILES POLICIES
-- =====================================================

CREATE POLICY "Allow authenticated users to read admin_profiles"
ON admin_profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow users to update their own profile"
ON admin_profiles FOR UPDATE
TO authenticated
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

-- =====================================================
-- COMPANY SETTINGS POLICIES
-- =====================================================

CREATE POLICY "Allow authenticated users to read company_settings"
ON company_settings FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to update company_settings"
ON company_settings FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- =====================================================
-- NOTIFICATION PREFERENCES POLICIES
-- =====================================================

CREATE POLICY "Allow users to read their own notification_preferences"
ON notification_preferences FOR SELECT
TO authenticated
USING (auth.uid()::text = user_id);

CREATE POLICY "Allow users to update their own notification_preferences"
ON notification_preferences FOR UPDATE
TO authenticated
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

-- Verify policies are created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
