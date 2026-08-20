import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase com a SERVICE ROLE key. Ignora a RLS.
 * SÓ pode ser usado no servidor (route handlers / server actions):
 * criação de encomendas a partir do checkout e do webhook do Stripe.
 * NUNCA importar num componente client.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY em falta no ambiente.");
  }
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
