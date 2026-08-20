import { createClient } from "./supabase/server";
import type { Product, ShippingRate } from "./types";

const PRODUCT_SELECT = "*, product_images(*)";

/** Produtos ativos, ordenados por data. */
export async function getProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("active", true)
    .order("created_at", { ascending: false });
  return (data as Product[] | null) ?? [];
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("active", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(8);
  return (data as Product[] | null) ?? [];
}

export async function getPromoProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("active", true)
    .eq("is_promo", true)
    .order("created_at", { ascending: false })
    .limit(8);
  return (data as Product[] | null) ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
  const product = data as Product | null;
  if (product?.product_images) {
    product.product_images.sort((a, b) => a.position - b.position);
  }
  return product;
}

export async function getShippingRates(): Promise<ShippingRate[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("shipping_rates")
    .select("*")
    .eq("active", true)
    .order("position", { ascending: true });
  return (data as ShippingRate[] | null) ?? [];
}
