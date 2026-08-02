-- Optional: create the shared test account in the EXISTING Supabase Auth DB.
-- Prefer creating via Studio (Authentication → Users → Add user) if unsure.
--
-- Email:    test@example.com
-- Password: test12
--
-- This uses extensions from a typical self-hosted Supabase stack.
-- Run only if you intentionally want this user in production Auth.

do $$
declare
  existing_id uuid;
begin
  select id into existing_id from auth.users where email = 'test@example.com';
  if existing_id is not null then
    raise notice 'Test account already exists: %', existing_id;
    return;
  end if;

  -- Recommended path: use Auth Admin API / Studio UI.
  -- Leaving a notice instead of a brittle direct insert across GoTrue versions.
  raise notice 'Create test user in Studio: test@example.com / test12 (Auto Confirm User = on)';
end $$;
