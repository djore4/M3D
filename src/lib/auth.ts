import { createClient } from "./supabase/server";
import { ADMIN_EMAIL } from "./supabase/config";

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

  if (ADMIN_EMAIL && user.email?.toLowerCase().trim() !== ADMIN_EMAIL) {
    return null;
  }
  return user;
}
