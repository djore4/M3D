import { createClient } from "./supabase/server";

/**
 * Devolve o utilizador autenticado SE for o administrador autorizado
 * (email igual a ADMIN_EMAIL). Caso contrário devolve null.
 */
export async function getAdminUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  if (adminEmail && user.email?.toLowerCase().trim() !== adminEmail) {
    return null;
  }
  return user;
}
