-- Universal certificate template: one row, admin-editable, readable by
-- everyone (learners need it to render their own certificate). The admin
-- pastes a hosted image URL for the certificate background (e.g. exported
-- from Canva and uploaded to any image host) plus where the learner's name
-- should be positioned on top of it -- no Supabase Storage bucket needed.

create table if not exists public.cert_template (
  id int primary key default 1,
  image_url text,
  name_top numeric not null default 45,
  name_left numeric not null default 50,
  font_size numeric not null default 42,
  color text not null default '#1a1a1a',
  updated_at timestamptz not null default now()
);

insert into public.cert_template (id) values (1) on conflict (id) do nothing;

alter table public.cert_template enable row level security;

drop policy if exists "anyone can read cert template" on public.cert_template;
create policy "anyone can read cert template" on public.cert_template for select using (true);

drop policy if exists "admins can update cert template" on public.cert_template;
create policy "admins can update cert template" on public.cert_template for update using (public.is_admin());

drop policy if exists "admins can insert cert template" on public.cert_template;
create policy "admins can insert cert template" on public.cert_template for insert with check (public.is_admin());
