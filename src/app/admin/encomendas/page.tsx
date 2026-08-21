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

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const supabase = createClient();
  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (searchParams.status && STATUS_LABEL[searchParams.status]) {
    query = query.eq("status", searchParams.status);
  }
  const { data } = await query;
  const orders = (data as Order[] | null) ?? [];

  const filters = [
    { key: "", label: "Todas" },
    { key: "pending", label: "Pendentes" },
    { key: "paid", label: "Pagas" },
    { key: "shipped", label: "Enviadas" },
    { key: "cancelled", label: "Canceladas" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-fg">Encomendas</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = (searchParams.status ?? "") === f.key;
          return (
            <Link
              key={f.key || "all"}
              href={f.key ? `/admin/encomendas?status=${f.key}` : "/admin/encomendas"}
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                active ? "bg-brand-500 text-[#0a0a0e]" : "bg-surface text-muted hover:bg-bg2"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      <div className="card overflow-hidden">
        {orders.length === 0 ? (
          <p className="p-6 text-sm text-muted">Nenhuma encomenda encontrada.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface2 text-left text-xs uppercase text-faint">
                <tr>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {orders.map((o) => (
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
                    <td className="px-4 py-3 text-right font-semibold">{formatPrice(o.total_cents, "pt")}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/encomendas/${o.id}`} className="text-brand-600 hover:underline">
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
