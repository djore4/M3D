import Stripe from "stripe";

let _stripe: Stripe | null = null;

/** Instância Stripe (lazy) — só no servidor. */
export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY em falta no ambiente.");
  _stripe = new Stripe(key, { apiVersion: "2024-06-20" });
  return _stripe;
}
