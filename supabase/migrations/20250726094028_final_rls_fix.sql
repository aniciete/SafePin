-- ========== STEP 1: DROP ALL EXISTING POLICIES TO START CLEAN ==========
DROP POLICY IF EXISTS "Users can view profiles" ON public.users;
DROP POLICY IF EXISTS "Users can view user profiles" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users, users can view their own profile" ON public.users;

DROP POLICY IF EXISTS "Admins have full access to reports" ON public.reports;
DROP POLICY IF EXISTS "Allow authorities to view reports in their jurisdiction" ON public.reports;
DROP POLICY IF EXISTS "Allow authorities to update reports in their jurisdiction" ON public.reports;


-- ========== STEP 2: CREATE THE NEW, SIMPLE, AND CORRECT POLICIES ==========

-- --- POLICIES FOR 'users' TABLE ---

-- Rule 1: ANY authenticated user can see their OWN profile. This is the most basic rule.
CREATE POLICY "Authenticated users can view their own profile"
ON public.users
FOR SELECT
TO authenticated
USING ( auth.uid() = id );

-- Rule 2: ANY user with the 'admin' role can see ALL profiles.
CREATE POLICY "Admins can view all user profiles"
ON public.users
FOR SELECT
TO authenticated
USING ( (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' );


-- --- POLICIES FOR 'reports' TABLE ---

-- Rule 3: An ADMIN can do anything to the reports table.
CREATE POLICY "Admins have full access to reports"
ON public.reports
FOR ALL
USING ( (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' )
WITH CHECK ( (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' );

-- Rule 4: An AUTHORITY can see reports in their own jurisdiction.
CREATE POLICY "Authorities can view reports in their jurisdiction"
ON public.reports
FOR SELECT
TO authenticated
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'authority'
  AND
  jurisdiction = (SELECT jurisdiction FROM public.users WHERE id = auth.uid())
);

-- Rule 5: An AUTHORITY can update reports in their own jurisdiction.
CREATE POLICY "Authorities can update reports in their jurisdiction"
ON public.reports
FOR UPDATE
TO authenticated
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'authority'
  AND
  jurisdiction = (SELECT jurisdiction FROM public.users WHERE id = auth.uid())
)
WITH CHECK (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'authority'
  AND
  jurisdiction = (SELECT jurisdiction FROM public.users WHERE id = auth.uid())
);