-- FinCtrl schema: clients, transactions, tasks
-- Run this once in the Supabase SQL Editor for your project.

create extension if not exists "pgcrypto";

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  contact text,
  status text not null default 'new' check (status in ('new', 'completed')),
  result text,
  paid numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  type text not null check (type in ('income', 'expense')),
  amount numeric not null check (amount > 0),
  category text,
  client_id uuid references clients(id) on delete set null,
  date date not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null,
  due date not null,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

alter table clients enable row level security;
alter table transactions enable row level security;
alter table tasks enable row level security;

create policy "clients_owner_all" on clients
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "transactions_owner_all" on transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "tasks_owner_all" on tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists transactions_user_date_idx on transactions (user_id, date);
create index if not exists tasks_user_due_idx on tasks (user_id, due);
create index if not exists clients_user_status_idx on clients (user_id, status);
