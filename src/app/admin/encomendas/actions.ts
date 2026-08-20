"use server";

import { revalidatePath } from "next/cache";
import { getAdminUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/lib/types";

const VALID: OrderStatus[] = ["pending", "paid", "shipped", "cancelled"];

export async function updateOrderStatus(orderId: string, formData: FormData) {
  const user = await getAdminUser();
  if (!user) throw new Error("Não autorizado");

  const status = String(formData.get("status") ?? "") as OrderStatus;
  if (!VALID.includes(status)) throw new Error("Estado inválido");

  const supabase = createClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/encomendas");
  revalidatePath(`/admin/encomendas/${orderId}`);
  revalidatePath("/admin");
}
