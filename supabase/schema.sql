-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Charities table
create table charities (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  image_url text,
  website text,
  is_featured boolean default false,
  created_at timestamptz default now()
);

-- Profiles table (extends Supabase auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role text default 'subscriber' check (role in ('subscriber', 'admin')),
  subscription_status text default 'inactive' check (subscription_status in ('active', 'inactive', 'cancelled', 'lapsed')),
  subscription_plan text check (subscription_plan in ('monthly', 'yearly')),
  subscription_renewal_date timestamptz,
  charity_id uuid references charities(id),
  charity_percentage numeric default 10 check (charity_percentage >= 10 and charity_percentage <= 100),
  created_at timestamptz default now()
);

-- Golf scores table
create table golf_scores (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  score integer not null check (score >= 1 and score <= 45),
  played_at date not null,
  created_at timestamptz default now()
);

-- Draws table
create table draws (
  id uuid primary key default uuid_generate_v4(),
  draw_date date not null,
  draw_type text default 'random' check (draw_type in ('random', 'algorithmic')),
  drawn_numbers integer[],
  status text default 'pending' check (status in ('pending', 'simulated', 'published')),
  prize_pool_total numeric default 0,
  jackpot_amount numeric default 0,
  created_at timestamptz default now()
);

-- Draw entries table
create table draw_entries (
  id uuid primary key default uuid_generate_v4(),
  draw_id uuid references draws(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  scores integer[] not null,
  match_count integer default 0,
  created_at timestamptz default now()
);

-- Winners table
create table winners (
  id uuid primary key default uuid_generate_v4(),
  draw_id uuid references draws(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  match_type text not null check (match_type in ('5-match', '4-match', '3-match')),
  prize_amount numeric not null,
  verification_status text default 'pending' check (verification_status in ('pending', 'approved', 'rejected')),
  proof_url text,
  created_at timestamptz default now()
);

-- Charity events table
create table charity_events (
  id uuid primary key default uuid_generate_v4(),
  charity_id uuid references charities(id) on delete cascade,
  title text not null,
  description text,
  event_date date,
  created_at timestamptz default now()
);

-- RLS
alter table profiles enable row level security;
alter table golf_scores enable row level security;
alter table draw_entries enable row level security;
alter table winners enable row level security;
alter table charities enable row level security;
alter table draws enable row level security;
alter table charity_events enable row level security;

create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Admins full access profiles" on profiles for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Users manage own scores" on golf_scores for all using (auth.uid() = user_id);
create policy "Admins manage all scores" on golf_scores for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Public can view charities" on charities for select using (true);
create policy "Admins manage charities" on charities for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Public view published draws" on draws for select using (status = 'published');
create policy "Admins manage draws" on draws for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Users view own entries" on draw_entries for select using (auth.uid() = user_id);
create policy "Admins manage entries" on draw_entries for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Users view own winnings" on winners for select using (auth.uid() = user_id);
create policy "Users upload proof" on winners for update using (auth.uid() = user_id);
create policy "Admins manage winners" on winners for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Public view events" on charity_events for select using (true);
create policy "Admins manage events" on charity_events for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  )
  on conflict (id) do nothing;
  return new;
exception
  when others then
    return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
