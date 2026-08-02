-- Foundation schema for the Jungschar platform shell.
-- Apply on the EXISTING self-hosted Supabase project (do not create a second Supabase).
-- Enable RLS on every public table.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  group_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create table if not exists public.module_flags (
  slug text primary key,
  enabled boolean not null default false,
  notes text,
  updated_at timestamptz not null default now()
);

alter table public.module_flags enable row level security;

-- Feature flags are readable for signed-in users; writes stay service-role only for now.
create policy "module_flags_select_authenticated"
  on public.module_flags
  for select
  to authenticated
  using (true);

insert into public.module_flags (slug, enabled, notes) values
  ('notfallblatt', true, 'Live app — link only'),
  ('inventar', false, 'Priority 1'),
  ('ecamp', true, 'Linked vendor'),
  ('sitzungsprotokolle', false, null),
  ('lagergeschichten', false, null),
  ('nextcloud', false, null),
  ('buch', false, null),
  ('safetool', false, null),
  ('wander', false, null),
  ('andachten', false, null),
  ('liederbuch', false, null),
  ('menuplanung', false, null),
  ('kalender', false, null),
  ('cevi-kleinanzeigen', false, null),
  ('chat', false, null),
  ('webseite', false, null)
on conflict (slug) do nothing;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
