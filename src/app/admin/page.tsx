import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, formatDate } from "@/lib/format";
import type { Order } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendente",
  paid: "Pago",
  shipped: "Enviado",
  cancelled: "Cancelado",
};
const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-300",
  paid: "bg-good/15 text-good",
  shipped: "bg-brand-500/15 text-brand-200",
  cancelled: "bg-white/10 text-muted",
};

export default async function AdminDashboard() {
  const supabase = createClient();

  const [{ data: orders }, { count: productCount }] = await Promise.all([
    supabase.from("orders").select("*").order("created_at", { ascending: false }),
    supabase.from("products").select("id", { count: "exact", head: true }),
  ]);

  const allOrders = (orders as Order[] | null) ?? [];
  const paidOrders = allOrders.filter((o) => o.status === "paid" || o.status === "shipped");
  const revenueCents = paidOrders.reduce((s, o) => s + o.total_cents, 0);
  const pendingCount = allOrders.filter((o) => o.status === "pending").length;
  const avgTicket = paidOrders.length ? Math.round(revenueCents / paidOrders.length) : 0;

  const cards = [
    { label: "Receita (pago)", value: formatPrice(revenueCents, "pt") },
    { label: "Encomendas pagas", value: String(paidOrders.length) },
    { label: "Ticket médio", value: formatPrice(avgTicket, "pt") },
    { label: "Pendentes", value: String(pendingCount) },
    { label: "Produtos", value: String(productCount ?? 0) },
  ];

  const recent = allOrders.slice(0, 8);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-fg">Painel</h1>
        <Link href="/admin/produtos/novo" className="btn-primary">
          + Novo produto
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="card p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-faint">{c.label}</p>
            <p className="mt-1 text-2xl font-bold text-fg">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-fg">Encomendas recentes</h2>
          <Link href="/admin/encomendas" className="text-sm text-brand-600 hover:underline">
            Ver todas
          </Link>
        </div>
        <div className="card overflow-hidden">
          {recent.length === 0 ? (
            <p className="p-6 text-sm text-muted">Ainda não há encomendas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface2 text-left text-xs uppercase text-faint">
                  <tr>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {recent.map((o) => (
                    <tr key={o.id} className="hover:bg-surface2">
                      <td className="whitespace-nowrap px-4 py-3 text-muted">
                        {formatDate(o.created_at, "pt")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-fg">{o.customer_name || "—"}</div>
                        <div className="text-xs text-faint">{o.customer_email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${STATUS_STYLE[o.status]}`}>{STATUS_LABEL[o.status]}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-fg">
                        {formatPrice(o.total_cents, "pt")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
