-- =====================================================================
-- Supabase Auth Setup SQL
-- Run this in your Supabase SQL Editor
-- =====================================================================

-- 1. Create profiles table linked to auth.users
-- =====================================================================

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  role text not null default 'client' check (role in ('admin', 'client')),
  created_at timestamptz default now()
);

-- Enable RLS on profiles
alter table profiles enable row level security;

-- Policy: Users can read their own profile
create policy "Users can read own profile"
on profiles for select
using (auth.uid() = id);

-- Policy: Users can update their own profile
create policy "Users can update own profile"
on profiles for update
using (auth.uid() = id);

-- 2. Add user_id column to bookings table
-- =====================================================================

alter table bookings add column user_id uuid references profiles(id);

-- Create index for faster lookups
create index bookings_user_id_idx on bookings(user_id);

-- 3. Add user_id column to client_sessions table
-- =====================================================================

alter table client_sessions add column user_id uuid references profiles(id);

-- Create index for faster lookups
create index client_sessions_user_id_idx on client_sessions(user_id);

-- 4. Create trigger function to auto-create profile on signup
-- =====================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'User'),
    new.email,
    'client'
  );
  return new;
end;
$$;

-- 5. Create trigger on auth.users
-- =====================================================================

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =====================================================================
-- MANUAL STEPS AFTER RUNNING THIS SQL
-- =====================================================================

-- To promote yourself to admin, run:
-- update profiles set role = 'admin' where email = 'your-photographer-email@example.com';

-- To verify the setup:
-- select * from profiles;
