
-- Drop user_roles table
DROP TABLE IF EXISTS public.user_roles;

-- Drop has_role function with CASCADE to remove dependent storage policies
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role) CASCADE;

-- Drop app_role enum
DROP TYPE IF EXISTS public.app_role;
