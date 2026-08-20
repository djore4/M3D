import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import { effectivePriceCents, type Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .order("created_at", { ascending: false });
  const products = (data as Product[] | null) ?? [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Produtos</h1>
        <Link href="/admin/produtos/novo" className="btn-primary">
          + Novo produto
        </Link>
      </div>

      <div className="card overflow-hidden">
        {products.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">
            Sem produtos.{" "}
            <Link href="/admin/produtos/novo" className="text-brand-600 hover:underline">
              Cria o primeiro
            </Link>
            .
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-3">Produto</th>
                  <th className="px-4 py-3 text-right">Preço</th>
                  <th className="px-4 py-3 text-right">Stock</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => {
                  const price = effectivePriceCents(p);
                  const cover = p.product_images?.[0]?.url ?? null;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-slate-100">
                            {cover ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={cover} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="grid h-full w-full place-items-center text-slate-300">🖨️</div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{p.name_pt}</div>
                            <div className="text-xs text-slate-400">/{p.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {formatPrice(price, "pt")}
                        {price < p.price_cents && (
                          <span className="ml-1 text-xs text-slate-400 line-through">
                            {formatPrice(p.price_cents, "pt")}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">{p.stock}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {p.active ? (
                            <span className="badge bg-green-100 text-green-800">Ativo</span>
                          ) : (
                            <span className="badge bg-slate-200 text-slate-600">Inativo</span>
                          )}
                          {p.is_featured && <span className="badge bg-amber-100 text-amber-800">★</span>}
                          {p.is_promo && <span className="badge bg-red-100 text-red-700">%</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/admin/produtos/${p.id}`} className="text-brand-600 hover:underline">
                          Editar
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
