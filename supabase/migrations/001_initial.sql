-- ============================================================
-- Rate Your Landlord: initial schema
-- Run in your Supabase project: SQL Editor → New query → Run
-- ============================================================

-- Tables

create table landlords (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null,
  addresses  text[]      not null default '{}',
  note       text,
  created_at timestamptz not null default now()
);

create table reviews (
  id                  uuid        primary key default gen_random_uuid(),
  landlord_id         uuid        not null references landlords(id) on delete cascade,
  user_id             uuid        references auth.users(id) on delete cascade,
  grade               text        not null check (grade in ('A','B','C','D','F')),
  building_condition  text        not null check (building_condition in ('A','B','C','D','F')),
  comment             text        not null,
  property_address    text,
  rent_amount         numeric,
  bathrooms           integer,
  bedrooms            integer,
  would_rent_again    boolean     not null,
  tags                text[]      not null default '{}',
  is_verified_student boolean     not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Admins: insert a row here (via the Supabase dashboard) to grant admin access.
create table admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- Views

create view landlords_with_stats as
select
  l.id,
  l.name,
  l.addresses,
  l.note,
  l.created_at,
  count(r.id)::int                                                     as review_count,
  mode() within group (order by r.grade)                              as grade_aggregate,
  mode() within group (order by r.building_condition)                 as building_grade,
  round(avg(case when r.would_rent_again then 100.0 else 0 end))::int as would_rent_again_pct
from landlords l
left join reviews r on r.landlord_id = l.id
group by l.id;

-- Triggers

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger reviews_updated_at
  before update on reviews
  for each row execute function set_updated_at();

create unique index landlords_name_lower_idx on landlords(lower(name));
create index reviews_landlord_id_idx on reviews(landlord_id);

-- RPC delete user
-- Lets authenticated users delete their own auth.users row from the client.
-- SECURITY DEFINER runs as the postgres role, which has auth schema access.

create or replace function delete_user()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$;

-- RPC get_user_count
-- Returns the total number of registered users.
-- SECURITY DEFINER runs as postgres, which has auth schema access.
-- Restricted to authenticated users so only logged-in admins can call it.

create or replace function get_user_count()
returns bigint
language sql
security definer
as $$
  select count(*) from auth.users;
$$;

grant execute on function get_user_count() to authenticated;

-- RLS

alter table landlords enable row level security;
alter table reviews    enable row level security;
alter table admins     enable row level security;

-- landlords
create policy "public read"         on landlords for select using (true);
create policy "auth insert"         on landlords for insert to authenticated with check (true);
create policy "admin update"        on landlords for update to authenticated
  using (exists (select 1 from admins where user_id = auth.uid()));
create policy "admin delete"        on landlords for delete to authenticated
  using (exists (select 1 from admins where user_id = auth.uid()));

-- reviews
create policy "public read"         on reviews for select using (true);
create policy "auth insert"         on reviews for insert to authenticated
  with check (auth.uid() = user_id);
create policy "own update"          on reviews for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own delete"          on reviews for delete to authenticated
  using (auth.uid() = user_id);
create policy "admin delete"        on reviews for delete to authenticated
  using (exists (select 1 from admins where user_id = auth.uid()));

-- admins (auth users can check whether they are admin)
create policy "auth read"           on admins for select to authenticated using (true);
