import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { shippingCostCents } from "@/lib/shipping";
import { effectivePriceCents } from "@/lib/types";
import type { Product, ShippingRate } from "@/lib/types";

export const runtime = "nodejs";

type Body = {
  items: { productId: string; quantity: number }[];
  shippingRateId: string;
  customer: {
    email: string;
    name: string;
    phone?: string;
    address: string;
    postal: string;
    city: string;
  };
  lang?: "pt" | "en";
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Pedido inválido" }, { status: 400 });
  }

  const { items, shippingRateId, customer } = body;
  if (!items?.length) return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
  if (!customer?.email || !customer?.address) {
    return NextResponse.json({ error: "Dados de contacto em falta" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // 1) Buscar os produtos reais (nunca confiar no preço vindo do cliente)
  const ids = items.map((i) => i.productId);
  const { data: productsData, error: prodErr } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .in("id", ids)
    .eq("active", true);

  if (prodErr) return NextResponse.json({ error: prodErr.message }, { status: 500 });
  const products = (productsData as Product[]) ?? [];

  // 2) Buscar a taxa de portes
  const { data: rateData } = await supabase
    .from("shipping_rates")
    .select("*")
    .eq("id", shippingRateId)
    .eq("active", true)
    .maybeSingle();
  const rate = rateData as ShippingRate | null;
  if (!rate) return NextResponse.json({ error: "Método de envio inválido" }, { status: 400 });

  // 3) Construir as linhas validadas
  const lineItems: { product: Product; quantity: number; unitPriceCents: number }[] = [];
  let subtotalCents = 0;

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return NextResponse.json({ error: "Produto indisponível" }, { status: 400 });
    const qty = Math.max(1, Math.min(item.quantity, product.stock));
    if (product.stock < 1) {
      return NextResponse.json({ error: `Sem stock: ${product.name_pt}` }, { status: 400 });
    }
    const unit = effectivePriceCents(product);
    subtotalCents += unit * qty;
    lineItems.push({ product, quantity: qty, unitPriceCents: unit });
  }

  const shippingCents = shippingCostCents(rate, subtotalCents);
  const totalCents = subtotalCents + shippingCents;

  // 4) Criar a encomenda (status pending)
  const { data: orderData, error: orderErr } = await supabase
    .from("orders")
    .insert({
      status: "pending",
      customer_email: customer.email,
      customer_name: customer.name,
      customer_phone: customer.phone ?? null,
      shipping_name: customer.name,
      shipping_address: customer.address,
      shipping_postal: customer.postal,
      shipping_city: customer.city,
      shipping_country: "PT",
      subtotal_cents: subtotalCents,
      shipping_cents: shippingCents,
      total_cents: totalCents,
      currency: "eur",
    })
    .select("id")
    .single();

  if (orderErr || !orderData) {
    return NextResponse.json({ error: orderErr?.message ?? "Erro ao criar encomenda" }, { status: 500 });
  }
  const orderId = orderData.id as string;

  // 5) Guardar as linhas da encomenda
  const { error: itemsErr } = await supabase.from("order_items").insert(
    lineItems.map((l) => ({
      order_id: orderId,
      product_id: l.product.id,
      name: l.product.name_pt,
      unit_price_cents: l.unitPriceCents,
      quantity: l.quantity,
    }))
  );
  if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 500 });

  // 6) Criar a sessão de checkout do Stripe
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
  const stripe = getStripe();

  const stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = lineItems.map((l) => ({
    quantity: l.quantity,
    price_data: {
      currency: "eur",
      unit_amount: l.unitPriceCents,
      product_data: {
        name: l.product.name_pt,
        images: l.product.product_images?.[0]?.url ? [l.product.product_images[0].url] : undefined,
      },
    },
  }));

  if (shippingCents > 0) {
    stripeLineItems.push({
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: shippingCents,
        product_data: { name: `Portes — ${rate.name}` },
      },
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: stripeLineItems,
      customer_email: customer.email,
      success_url: `${siteUrl}/encomenda/sucesso?order=${orderId}`,
      cancel_url: `${siteUrl}/carrinho`,
      metadata: { order_id: orderId },
      payment_intent_data: { metadata: { order_id: orderId } },
    });

    await supabase.from("orders").update({ stripe_session_id: session.id }).eq("id", orderId);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    // Se o Stripe falhar, marca a encomenda como cancelada
    await supabase.from("orders").update({ status: "cancelled" }).eq("id", orderId);
    const msg = err instanceof Error ? err.message : "Erro no Stripe";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
