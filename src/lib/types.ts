export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  storage_path: string | null;
  position: number;
};

export type Product = {
  id: string;
  slug: string;
  name_pt: string;
  name_en: string;
  description_pt: string;
  description_en: string;
  price_cents: number;
  promo_price_cents: number | null;
  is_promo: boolean;
  is_featured: boolean;
  stock: number;
  sizes: string[];
  google_photos_url: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  product_images?: ProductImage[];
};

export type ShippingRate = {
  id: string;
  name: string;
  price_cents: number;
  free_above_cents: number | null;
  active: boolean;
  position: number;
};

export type OrderStatus = "pending" | "paid" | "shipped" | "cancelled";

export type Order = {
  id: string;
  status: OrderStatus;
  customer_email: string;
  customer_name: string | null;
  customer_phone: string | null;
  shipping_name: string | null;
  shipping_address: string | null;
  shipping_postal: string | null;
  shipping_city: string | null;
  shipping_country: string | null;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  currency: string;
  stripe_session_id: string | null;
  created_at: string;
  paid_at: string | null;
  order_items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  name: string;
  size: string | null;
  unit_price_cents: number;
  quantity: number;
};

/** A linha do carrinho tal como guardada no cliente. */
export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  size: string | null;
  unitPriceCents: number;
  quantity: number;
  imageUrl: string | null;
  stock: number;
};

/** Chave única de uma linha de carrinho (produto + tamanho). */
export function cartKey(productId: string, size: string | null): string {
  return `${productId}|${size ?? ""}`;
}

/** Preço efetivo de um produto (considera promoção). */
export function effectivePriceCents(p: Pick<Product, "price_cents" | "promo_price_cents" | "is_promo">): number {
  if (p.is_promo && p.promo_price_cents != null && p.promo_price_cents < p.price_cents) {
    return p.promo_price_cents;
  }
  return p.price_cents;
}
