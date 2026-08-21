-- =====================================================================
-- M3D — tamanhos das peças (S/M/L)
-- =====================================================================

-- Tamanhos disponíveis por produto (subconjunto de S, M, L)
alter table public.products
  add column if not exists sizes text[] not null default '{}';

-- Tamanho escolhido em cada linha de encomenda
alter table public.order_items
  add column if not exists size text;
