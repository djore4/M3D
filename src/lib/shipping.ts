import type { ShippingRate } from "./types";

/** Calcula os portes para uma taxa, aplicando envio grátis acima do limite. */
export function shippingCostCents(rate: ShippingRate, subtotalCents: number): number {
  if (rate.free_above_cents != null && subtotalCents >= rate.free_above_cents) {
    return 0;
  }
  return rate.price_cents;
}
