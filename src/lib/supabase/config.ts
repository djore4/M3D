/**
 * Configuração pública do Supabase.
 *
 * A URL e a ANON KEY são valores PÚBLICOS por natureza — a anon key é enviada
 * para o browser em qualquer aplicação Supabase e a proteção real dos dados é
 * feita pela Row Level Security da base de dados. Por isso podem ter valores
 * por defeito aqui, permitindo que o site funcione mesmo quando não há variáveis
 * de ambiente configuradas no alojamento.
 *
 * As variáveis de ambiente, quando definidas, têm sempre prioridade.
 *
 * NUNCA colocar aqui a SERVICE_ROLE_KEY nem chaves do Stripe — essas são
 * secretas e ficam apenas em variáveis de ambiente.
 */
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wzjuhmifuljzezxeauhl.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
   "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6anVobWlmdWxqemV6eGVhdWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyNTg0NDMsImV4cCI6MjEwMjgzNDQ0M30",
   "79ZdnYtNOzDOR4tQWHV4G8qcXkxPy6YaQNnmJRH3tGA"].join(".");

/** Email do administrador autorizado a aceder ao backoffice. */
export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "joao4duarte@gmail.com")
  .toLowerCase()
  .trim();
