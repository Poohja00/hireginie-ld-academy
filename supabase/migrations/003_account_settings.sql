-- Account settings: extend profiles with self-editable fields. Users update
-- their own profile through update_my_profile() rather than a direct UPDATE
-- policy, so is_admin/suspended stay protected from self-escalation.

alter table public.profiles
  add column if not exists avatar_url text,
  add column if not exists bio text,
  add column if not exists location text,
  add column if not exists github text,
  add column if not exists linkedin text,
  add column if not exists twitter text,
  add column if not exists website text,
  add column if not exists workplace text;

create or replace function public.update_my_profile(
  p_full_name text,
  p_avatar_url text,
  p_bio text,
  p_location text,
  p_github text,
  p_linkedin text,
  p_twitter text,
  p_website text,
  p_workplace text
) returns void as $$
begin
  update public.profiles set
    full_name = coalesce(p_full_name, full_name),
    avatar_url = p_avatar_url,
    bio = p_bio,
    location = p_location,
    github = p_github,
    linkedin = p_linkedin,
    twitter = p_twitter,
    website = p_website,
    workplace = p_workplace
  where id = auth.uid();
end;
$$ language plpgsql security definer;

grant execute on function public.update_my_profile to authenticated;

-- Storage bucket "avatars" must be created manually in the dashboard
-- (Storage -> New bucket -> name "avatars" -> toggle Public -> Create),
-- then run the policies below.

drop policy if exists "users can upload own avatar" on storage.objects;
create policy "users can upload own avatar" on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "users can update own avatar" on storage.objects;
create policy "users can update own avatar" on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "anyone can view avatars" on storage.objects;
create policy "anyone can view avatars" on storage.objects for select
  using (bucket_id = 'avatars');
