-- Students module for FinCtrl
-- Run this once in the Supabase SQL Editor for your project.

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  test_date date,
  result text,
  paid numeric not null default 0,
  created_at timestamptz not null default now()
);

alter table students enable row level security;

create policy "students_owner_all" on students
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists students_user_test_date_idx on students (user_id, test_date);
