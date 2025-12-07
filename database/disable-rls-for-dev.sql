-- =====================================================
-- DISABLE RLS FOR DEVELOPMENT
-- =====================================================
-- WARNING: Only use this for development!
-- For production, you should create proper RLS policies
-- =====================================================

-- Disable RLS on main tables
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE tour_packages DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE schedules DISABLE ROW LEVEL SECURITY;
ALTER TABLE cancellation_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'bookings', 
    'customers', 
    'tour_packages', 
    'payments', 
    'schedules',
    'cancellation_requests',
    'admin_profiles',
    'company_settings',
    'notification_preferences'
  )
ORDER BY tablename;

-- Expected result: rowsecurity should be 'false' for all tables
