-- Admin dashboard support: profiles table, auto-provisioning trigger,
-- admin RLS policies. Purely additive — does not touch progress/attempts/
-- certificates table schemas, so nothing currently in flight is affected.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  is_admin boolean not null default false,
  suspended boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Auto-create a profile row whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill profiles for anyone who already signed up before this migration.
insert into public.profiles (id, email, full_name)
select id, email, raw_user_meta_data->>'full_name' from auth.users
on conflict (id) do nothing;

-- Helper used inside RLS policies (security definer avoids recursive RLS checks).
create or replace function public.is_admin()
returns boolean as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$ language sql security definer stable;

-- profiles: users see their own row; admins see/update every row.
drop policy if exists "select own profile" on public.profiles;
create policy "select own profile" on public.profiles for select using (auth.uid() = id);

drop policy if exists "admins select all profiles" on public.profiles;
create policy "admins select all profiles" on public.profiles for select using (public.is_admin());

drop policy if exists "admins update all profiles" on public.profiles;
create policy "admins update all profiles" on public.profiles for update using (public.is_admin());

-- Admin read access across the existing tables (additive — existing
-- "users see only their own rows" policies on these tables stay intact).
drop policy if exists "admins select all progress" on public.progress;
create policy "admins select all progress" on public.progress for select using (public.is_admin());

drop policy if exists "admins select all attempts" on public.attempts;
create policy "admins select all attempts" on public.attempts for select using (public.is_admin());

drop policy if exists "admins select all certificates" on public.certificates;
create policy "admins select all certificates" on public.certificates for select using (public.is_admin());

drop policy if exists "admins insert certificates" on public.certificates;
create policy "admins insert certificates" on public.certificates for insert with check (public.is_admin());

drop policy if exists "admins update certificates" on public.certificates;
create policy "admins update certificates" on public.certificates for update using (public.is_admin());

drop policy if exists "admins delete certificates" on public.certificates;
create policy "admins delete certificates" on public.certificates for delete using (public.is_admin());

-- Grant yourself admin access (run this last, after your account exists):
-- update public.profiles set is_admin = true where email = 'pooja.mahapatra@hireginie.com';
