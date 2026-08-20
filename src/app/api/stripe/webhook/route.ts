import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
// O corpo do webhook tem de ser lido em bruto para validar a assinatura
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook não configurado" }, { status: 500 });

  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Assinatura em falta" }, { status: 400 });

  const payload = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Assinatura inválida";
    return NextResponse.json({ error: `Webhook: ${msg}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;

    if (orderId && session.payment_status === "paid") {
      const supabase = createAdminClient();

      // Marca a encomenda como paga (idempotente: só se ainda não estava paga)
      const { data: order } = await supabase
        .from("orders")
        .select("id, status")
        .eq("id", orderId)
        .maybeSingle();

      if (order && order.status !== "paid" && order.status !== "shipped") {
        await supabase
          .from("orders")
          .update({ status: "paid", paid_at: new Date().toISOString() })
          .eq("id", orderId);

        // Decrementa o stock de cada produto comprado
        const { data: items } = await supabase
          .from("order_items")
          .select("product_id, quantity")
          .eq("order_id", orderId);

        for (const item of items ?? []) {
          if (!item.product_id) continue;
          const { data: prod } = await supabase
            .from("products")
            .select("stock")
            .eq("id", item.product_id)
            .maybeSingle();
          if (prod) {
            const newStock = Math.max(0, prod.stock - item.quantity);
            await supabase.from("products").update({ stock: newStock }).eq("id", item.product_id);
          }
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
