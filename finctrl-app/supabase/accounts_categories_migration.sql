-- Accounts (bank/cash balances) + custom expense categories for FinCtrl
-- Run this once in the Supabase SQL Editor for your project.

create table if not exists accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  bank text,
  balance numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

alter table accounts enable row level security;
alter table categories enable row level security;

create policy "accounts_owner_all" on accounts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "categories_owner_all" on categories
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists accounts_user_idx on accounts (user_id);
create index if not exists categories_user_idx on categories (user_id);
