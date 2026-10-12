-- Genesis Autos website content foundation.
-- Public storefront access is read-only and limited to the live site and published records.
-- Hub/admin writes must go through an authenticated backend; do not add broad client write policies.

create extension if not exists pgcrypto;

create table if not exists public.websites (
  id uuid primary key default gen_random_uuid(),
  client_id uuid,
  name text not null,
  slug text not null unique,
  domain text,
  status text not null default 'draft' check (status in ('draft','live','paused')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.website_content (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null unique references public.websites(id) on delete cascade,
  title text,
  description text,
  logo_url text,
  business_details jsonb not null default '{}'::jsonb,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.websites(id) on delete cascade,
  external_key text not null,
  name text not null,
  slug text not null,
  category text not null default 'Uncategorised',
  description text not null default '',
  price numeric(12,2),
  currency text not null default 'NGN',
  image_path text,
  image_url text,
  brand text,
  details text,
  is_published boolean not null default false,
  display_order integer not null default 0,
  source text not null default 'import',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (website_id, external_key),
  unique (website_id, slug)
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.websites(id) on delete cascade,
  external_key text not null,
  name text not null,
  description text not null default '',
  is_published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (website_id, external_key)
);

create index if not exists products_website_published_order_idx
  on public.products (website_id, is_published, display_order);
create index if not exists services_website_published_order_idx
  on public.services (website_id, is_published, display_order);

alter table public.websites enable row level security;
alter table public.website_content enable row level security;
alter table public.products enable row level security;
alter table public.services enable row level security;

drop policy if exists "Public can read live websites" on public.websites;
create policy "Public can read live websites"
  on public.websites for select to anon, authenticated
  using (status = 'live');

drop policy if exists "Public can read live website content" on public.website_content;
create policy "Public can read live website content"
  on public.website_content for select to anon, authenticated
  using (exists (select 1 from public.websites w where w.id = website_id and w.status = 'live'));

drop policy if exists "Public can read published products on live websites" on public.products;
create policy "Public can read published products on live websites"
  on public.products for select to anon, authenticated
  using (is_published and exists (select 1 from public.websites w where w.id = website_id and w.status = 'live'));

drop policy if exists "Public can read published services on live websites" on public.services;
create policy "Public can read published services on live websites"
  on public.services for select to anon, authenticated
  using (is_published and exists (select 1 from public.websites w where w.id = website_id and w.status = 'live'));

grant usage on schema public to anon, authenticated;
grant select on public.websites, public.website_content, public.products, public.services to anon, authenticated;

insert into public.websites (name, slug, domain, status)
values ('Genesis Autos', 'genesis-autos-1218d5', 'genesisautos.org', 'draft')
on conflict (slug) do update
set name = excluded.name, domain = excluded.domain, updated_at = now();

insert into public.website_content (website_id, title, description, business_details, content)
select id,
  'Genesis Autos',
  'Automobile spare parts and automotive products business in Iyana Ipaja, Lagos.',
  jsonb_build_object(
    'telephone', '+2347065379450',
    'secondary_telephone', '+2349083561212',
    'address', '62 Alimosho Rd., Opp. Multigrace Sch. Alagutan B/Stop, Iyana Ipaja, Lagos, Nigeria',
    'instagram', 'https://www.instagram.com/genesisautosalimosho/',
    'tiktok', 'https://www.tiktok.com/@genesisautosalimosho',
    'telegram', 'https://t.me/genesisautosalimosho'
  ),
  jsonb_build_object('currency','NGN','catalogue_source','GenesisAutos/src/App.tsx')
from public.websites where slug = 'genesis-autos-1218d5'
on conflict (website_id) do update set
  title = excluded.title,
  description = excluded.description,
  business_details = excluded.business_details,
  content = excluded.content,
  updated_at = now();

insert into public.services (website_id, external_key, name, description, is_published, display_order)
select w.id, s.external_key, s.name, s.description, false, s.display_order
from public.websites w
cross join (values
 ('spare-parts-sourcing','Spare Parts Sourcing','Get assistance finding the automotive parts you need.',1),
 ('vehicle-support','Vehicle Support','Automotive support for vehicle owners and businesses.',2),
 ('parts-enquiries','Parts Enquiries','Contact Genesis Autos to ask about availability and pricing.',3)
) as s(external_key,name,description,display_order)
where w.slug = 'genesis-autos-1218d5'
on conflict (website_id, external_key) do update set
  name = excluded.name,
  description = excluded.description,
  display_order = excluded.display_order,
  updated_at = now();
