-- Synex Realty — Supabase schema
-- Run this once in the Supabase Dashboard → SQL Editor.
-- Safe to re-run: uses "if not exists" / "or replace" where possible.

-- ── PROPERTIES ──────────────────────────────────────────────
create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  address text not null,
  area text not null,
  price numeric not null,
  price_display text not null,
  price_per_sqft text,
  type text not null,               -- 'Residential' | 'Commercial'
  category text not null,           -- 'Apartment' | 'Penthouse' | 'Shop' | ...
  bhk int,
  sqft int,
  sqft_display text,
  floor int,
  total_floors int,
  bathrooms int,
  parking int,
  facing text,
  possession text,
  age_years int,
  status text not null default 'Available',
  purpose text not null default 'Buy',   -- 'Buy' | 'Rent'
  featured boolean not null default false,
  is_new boolean not null default false,
  is_price_drop boolean not null default false,
  rera_approved boolean not null default false,
  video_url text,                   -- ImageKit URL, nullable
  images text[] not null default '{}',      -- ImageKit URLs
  amenities text[] not null default '{}',
  highlights text[] not null default '{}',
  description text,
  created_at timestamptz not null default now()
);

create index if not exists properties_area_idx on properties (area);
create index if not exists properties_featured_idx on properties (featured);

alter table properties enable row level security;

drop policy if exists "Public read properties" on properties;
create policy "Public read properties" on properties
  for select using (true);

drop policy if exists "Authenticated write properties" on properties;
create policy "Authenticated write properties" on properties
  for insert to authenticated with check (true);

drop policy if exists "Authenticated update properties" on properties;
create policy "Authenticated update properties" on properties
  for update to authenticated using (true);

drop policy if exists "Authenticated delete properties" on properties;
create policy "Authenticated delete properties" on properties
  for delete to authenticated using (true);

-- ── TESTIMONIALS ────────────────────────────────────────────
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  location text,
  quote text not null,
  rating int not null default 5,
  avatar text,                      -- ImageKit URL
  created_at timestamptz not null default now()
);

alter table testimonials enable row level security;

drop policy if exists "Public read testimonials" on testimonials;
create policy "Public read testimonials" on testimonials
  for select using (true);

drop policy if exists "Authenticated write testimonials" on testimonials;
create policy "Authenticated write testimonials" on testimonials
  for insert to authenticated with check (true);

drop policy if exists "Authenticated update testimonials" on testimonials;
create policy "Authenticated update testimonials" on testimonials
  for update to authenticated using (true);

drop policy if exists "Authenticated delete testimonials" on testimonials;
create policy "Authenticated delete testimonials" on testimonials
  for delete to authenticated using (true);

-- ── LEADS (CRM) ─────────────────────────────────────────────
-- Unifies the Contact page form, per-property inquiry form, and schedule-visit modal.
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text,
  email text,
  source text not null check (source in ('contact_page', 'property_inquiry', 'schedule_visit')),
  property_id uuid references properties(id) on delete set null,
  details jsonb not null default '{}',   -- form-specific free fields (message, budget, preferred date, etc.)
  status text not null default 'new' check (status in ('new', 'contacted', 'closed'))
);

create index if not exists leads_status_idx on leads (status);
create index if not exists leads_created_at_idx on leads (created_at desc);

alter table leads enable row level security;

drop policy if exists "Public submit leads" on leads;
create policy "Public submit leads" on leads
  for insert with check (true);

drop policy if exists "Authenticated read leads" on leads;
create policy "Authenticated read leads" on leads
  for select to authenticated using (true);

drop policy if exists "Authenticated update leads" on leads;
create policy "Authenticated update leads" on leads
  for update to authenticated using (true);

drop policy if exists "Authenticated delete leads" on leads;
create policy "Authenticated delete leads" on leads
  for delete to authenticated using (true);

-- ── PAGE VIEWS (self-tracked analytics) ─────────────────────
create table if not exists page_views (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  path text not null,
  visitor_id text not null       -- anonymous id persisted in the visitor's localStorage
);

create index if not exists page_views_created_at_idx on page_views (created_at desc);
create index if not exists page_views_visitor_id_idx on page_views (visitor_id);

alter table page_views enable row level security;

drop policy if exists "Public log page views" on page_views;
create policy "Public log page views" on page_views
  for insert with check (true);

drop policy if exists "Authenticated read page views" on page_views;
create policy "Authenticated read page views" on page_views
  for select to authenticated using (true);
