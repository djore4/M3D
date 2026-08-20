-- =====================================================================
-- Dados de exemplo (opcional). Executar depois de 0001_init.sql.
-- =====================================================================

-- Portes de envio (Portugal continental)
insert into public.shipping_rates (name, price_cents, free_above_cents, position)
values
  ('CTT Correio Registado', 350, 5000, 1),
  ('CTT Expresso', 650, 8000, 2)
on conflict do nothing;

-- Produtos de exemplo
insert into public.products
  (slug, name_pt, name_en, description_pt, description_en, price_cents, is_featured, stock)
values
  ('vaso-geometrico', 'Vaso Geométrico', 'Geometric Vase',
   'Vaso decorativo impresso em 3D com padrão geométrico. PLA reciclável.',
   'Decorative 3D printed vase with a geometric pattern. Recyclable PLA.',
   1590, true, 12),
  ('suporte-telemovel', 'Suporte de Telemóvel', 'Phone Stand',
   'Suporte ergonómico para telemóvel, ideal para secretária.',
   'Ergonomic phone stand, perfect for your desk.',
   990, true, 30),
  ('chaveiro-personalizado', 'Chaveiro Personalizado', 'Custom Keychain',
   'Chaveiro impresso em 3D. Escolhe a cor no checkout.',
   '3D printed keychain. Choose your colour at checkout.',
   490, false, 100)
on conflict (slug) do nothing;
