-- =====================================================================
-- M3D — schema inicial
-- Loja de merchandising impresso em 3D
-- Executar no SQL Editor do Supabase (ou via `supabase db push`).
-- =====================================================================

-- Extensões ------------------------------------------------------------
create extension if not exists "pgcrypto";

-- =====================================================================
-- PRODUTOS
-- =====================================================================
create table if not exists public.products (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  name_pt           text not null,
  name_en           text not null default '',
  description_pt    text not null default '',
  description_en    text not null default '',
  -- Preços guardados em cêntimos para evitar erros de vírgula flutuante
  price_cents       integer not null check (price_cents >= 0),
  promo_price_cents integer check (promo_price_cents >= 0),
  is_promo          boolean not null default false,
  is_featured       boolean not null default false,
  stock             integer not null default 0 check (stock >= 0),
  -- Link do álbum/foto partilhado do Google Fotos (referência de gestão)
  google_photos_url text,
  active            boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists products_active_idx    on public.products (active);
create index if not exists products_featured_idx  on public.products (is_featured) where is_featured;

-- =====================================================================
-- FOTOS DOS PRODUTOS (upload direto -> Supabase Storage)
-- =====================================================================
create table if not exists public.product_images (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  url         text not null,           -- URL pública no Storage
  storage_path text,                   -- caminho no bucket (para apagar)
  position    integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists product_images_product_idx on public.product_images (product_id, position);

-- =====================================================================
-- CONFIGURAÇÃO DE PORTES DE ENVIO
-- =====================================================================
create table if not exists public.shipping_rates (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  price_cents      integer not null check (price_cents >= 0),
  -- Acima deste valor de encomenda os portes são grátis (null = nunca grátis)
  free_above_cents integer,
  active           boolean not null default true,
  position         integer not null default 0,
  created_at       timestamptz not null default now()
);

-- =====================================================================
-- ENCOMENDAS (checkout como convidado)
-- =====================================================================
create table if not exists public.orders (
  id                uuid primary key default gen_random_uuid(),
  -- status: pending | paid | shipped | cancelled
  status            text not null default 'pending',
  customer_email    text not null,
  customer_name     text,
  customer_phone    text,
  shipping_name     text,
  shipping_address  text,
  shipping_postal   text,
  shipping_city     text,
  shipping_country  text default 'PT',
  subtotal_cents    integer not null default 0,
  shipping_cents    integer not null default 0,
  total_cents       integer not null default 0,
  currency          text not null default 'eur',
  stripe_session_id text unique,
  created_at        timestamptz not null default now(),
  paid_at           timestamptz
);

create index if not exists orders_status_idx  on public.orders (status);
create index if not exists orders_created_idx  on public.orders (created_at desc);

-- =====================================================================
-- LINHAS DE ENCOMENDA
-- =====================================================================
create table if not exists public.order_items (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid not null references public.orders(id) on delete cascade,
  product_id      uuid references public.products(id) on delete set null,
  name            text not null,             -- snapshot do nome no momento da compra
  unit_price_cents integer not null,         -- snapshot do preço
  quantity        integer not null check (quantity > 0),
  created_at      timestamptz not null default now()
);

create index if not exists order_items_order_idx on public.order_items (order_id);

-- =====================================================================
-- TRIGGER: manter updated_at nos produtos
-- =====================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- =====================================================================
-- ROW LEVEL SECURITY
-- Leitura pública dos catálogos; escrita apenas por utilizadores
-- autenticados (o admin). O service_role (usado no servidor para
-- webhooks e criação de encomendas) ignora sempre a RLS.
-- =====================================================================
alter table public.products       enable row level security;
alter table public.product_images enable row level security;
alter table public.shipping_rates enable row level security;
alter table public.orders         enable row level security;
alter table public.order_items    enable row level security;

-- Produtos: qualquer pessoa lê os ativos; autenticados leem/gerem tudo
drop policy if exists products_public_read on public.products;
create policy products_public_read on public.products
  for select using (active = true);

drop policy if exists products_admin_all on public.products;
create policy products_admin_all on public.products
  for all to authenticated using (true) with check (true);

-- Imagens: leitura pública, gestão por autenticados
drop policy if exists product_images_public_read on public.product_images;
create policy product_images_public_read on public.product_images
  for select using (true);

drop policy if exists product_images_admin_all on public.product_images;
create policy product_images_admin_all on public.product_images
  for all to authenticated using (true) with check (true);

-- Portes: leitura pública dos ativos, gestão por autenticados
drop policy if exists shipping_public_read on public.shipping_rates;
create policy shipping_public_read on public.shipping_rates
  for select using (active = true);

drop policy if exists shipping_admin_all on public.shipping_rates;
create policy shipping_admin_all on public.shipping_rates
  for all to authenticated using (true) with check (true);

-- Encomendas e linhas: SEM acesso público. Só autenticados (admin) leem.
-- A criação é feita pelo servidor com service_role (ignora RLS).
drop policy if exists orders_admin_read on public.orders;
create policy orders_admin_read on public.orders
  for select to authenticated using (true);

drop policy if exists orders_admin_update on public.orders;
create policy orders_admin_update on public.orders
  for update to authenticated using (true) with check (true);

drop policy if exists order_items_admin_read on public.order_items;
create policy order_items_admin_read on public.order_items
  for select to authenticated using (true);
