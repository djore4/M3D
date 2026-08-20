import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, formatDate } from "@/lib/format";
import { updateOrderStatus } from "../actions";
import type { Order } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendente",
  paid: "Pago",
  shipped: "Enviado",
  cancelled: "Cancelado",
};

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", params.id)
    .maybeSingle();

  const order = data as Order | null;
  if (!order) notFound();

  const items = order.order_items ?? [];
  const statusAction = updateOrderStatus.bind(null, order.id);

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/encomendas" className="mb-4 inline-block text-sm text-slate-500 hover:text-slate-800">
        ← Encomendas
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Encomenda</h1>
          <p className="font-mono text-xs text-slate-400">{order.id}</p>
          <p className="text-sm text-slate-500">{formatDate(order.created_at, "pt")}</p>
        </div>
        <form action={statusAction} className="flex items-center gap-2">
          <select name="status" defaultValue={order.status} className="input w-auto">
            {Object.entries(STATUS_LABEL).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          <button type="submit" className="btn-primary">
            Atualizar
          </button>
        </form>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="card p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Cliente</h2>
          <p className="font-medium text-slate-900">{order.customer_name || "—"}</p>
          <p className="text-sm text-slate-600">{order.customer_email}</p>
          {order.customer_phone && <p className="text-sm text-slate-600">{order.customer_phone}</p>}
        </div>
        <div className="card p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Envio</h2>
          <p className="text-sm text-slate-700">{order.shipping_address}</p>
          <p className="text-sm text-slate-700">
            {order.shipping_postal} {order.shipping_city}
          </p>
          <p className="text-sm text-slate-700">{order.shipping_country}</p>
        </div>
      </div>

      <div className="card mt-6 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Artigo</th>
              <th className="px-4 py-3 text-center">Qtd.</th>
              <th className="px-4 py-3 text-right">Preço</th>
              <th className="px-4 py-3 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((it) => (
              <tr key={it.id}>
                <td className="px-4 py-3 font-medium text-slate-900">{it.name}</td>
                <td className="px-4 py-3 text-center">{it.quantity}</td>
                <td className="px-4 py-3 text-right">{formatPrice(it.unit_price_cents, "pt")}</td>
                <td className="px-4 py-3 text-right">
                  {formatPrice(it.unit_price_cents * it.quantity, "pt")}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-slate-200 text-sm">
            <tr>
              <td colSpan={3} className="px-4 py-2 text-right text-slate-500">
                Subtotal
              </td>
              <td className="px-4 py-2 text-right">{formatPrice(order.subtotal_cents, "pt")}</td>
            </tr>
            <tr>
              <td colSpan={3} className="px-4 py-2 text-right text-slate-500">
                Portes
              </td>
              <td className="px-4 py-2 text-right">{formatPrice(order.shipping_cents, "pt")}</td>
            </tr>
            <tr className="font-bold text-slate-900">
              <td colSpan={3} className="px-4 py-3 text-right">
                Total
              </td>
              <td className="px-4 py-3 text-right">{formatPrice(order.total_cents, "pt")}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
