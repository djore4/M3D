"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/format";

const BUCKET = "product-images";

async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) throw new Error("Não autorizado");
  return user;
}

/** Converte um valor em euros (string) para cêntimos. */
function eurosToCents(value: FormDataEntryValue | null): number | null {
  if (value == null || value === "") return null;
  const n = parseFloat(String(value).replace(",", "."));
  if (Number.isNaN(n)) return null;
  return Math.round(n * 100);
}

function buildProductPayload(formData: FormData) {
  const namePt = String(formData.get("name_pt") ?? "").trim();
  const providedSlug = String(formData.get("slug") ?? "").trim();
  const priceCents = eurosToCents(formData.get("price")) ?? 0;
  const promoCents = eurosToCents(formData.get("promo_price"));

  return {
    name_pt: namePt,
    name_en: String(formData.get("name_en") ?? "").trim(),
    description_pt: String(formData.get("description_pt") ?? "").trim(),
    description_en: String(formData.get("description_en") ?? "").trim(),
    slug: providedSlug ? slugify(providedSlug) : slugify(namePt),
    price_cents: priceCents,
    promo_price_cents: promoCents,
    is_promo: formData.get("is_promo") === "on",
    is_featured: formData.get("is_featured") === "on",
    stock: parseInt(String(formData.get("stock") ?? "0"), 10) || 0,
    google_photos_url: String(formData.get("google_photos_url") ?? "").trim() || null,
    active: formData.get("active") === "on",
  };
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();
  const payload = buildProductPayload(formData);

  if (!payload.name_pt) throw new Error("O nome (PT) é obrigatório");
  if (!payload.slug) payload.slug = `produto-${Date.now()}`;

  const { data, error } = await supabase
    .from("products")
    .insert(payload)
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/admin/produtos");
  revalidatePath("/loja");
  redirect(`/admin/produtos/${data.id}`);
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();
  const payload = buildProductPayload(formData);

  if (!payload.name_pt) throw new Error("O nome (PT) é obrigatório");

  const { error } = await supabase.from("products").update(payload).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/produtos");
  revalidatePath(`/admin/produtos/${id}`);
  revalidatePath("/loja");
  revalidatePath(`/produto/${payload.slug}`);
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();

  // Apaga as imagens do storage associadas
  const { data: images } = await supabase
    .from("product_images")
    .select("storage_path")
    .eq("product_id", id);
  const paths = (images ?? []).map((i) => i.storage_path).filter(Boolean) as string[];
  if (paths.length) await supabase.storage.from(BUCKET).remove(paths);

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/produtos");
  revalidatePath("/loja");
  redirect("/admin/produtos");
}

export async function uploadProductImage(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();

  const productId = String(formData.get("product_id") ?? "");
  const file = formData.get("file") as File | null;
  if (!productId || !file || file.size === 0) throw new Error("Ficheiro em falta");

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${productId}/${crypto.randomUUID()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, arrayBuffer, { contentType: file.type || "image/jpeg", upsert: false });
  if (upErr) throw new Error(upErr.message);

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);

  // Posição = nº de imagens atuais
  const { count } = await supabase
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);

  const { error: insErr } = await supabase.from("product_images").insert({
    product_id: productId,
    url: pub.publicUrl,
    storage_path: path,
    position: count ?? 0,
  });
  if (insErr) throw new Error(insErr.message);

  revalidatePath(`/admin/produtos/${productId}`);
  revalidatePath("/loja");
}

export async function deleteProductImage(imageId: string, productId: string) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: image } = await supabase
    .from("product_images")
    .select("storage_path")
    .eq("id", imageId)
    .maybeSingle();

  if (image?.storage_path) {
    await supabase.storage.from(BUCKET).remove([image.storage_path]);
  }
  const { error } = await supabase.from("product_images").delete().eq("id", imageId);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/produtos/${productId}`);
  revalidatePath("/loja");
}
