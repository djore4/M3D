import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";
import { updateProduct, deleteProduct, uploadProductImage, deleteProductImage } from "../actions";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("id", params.id)
    .maybeSingle();

  const product = data as Product | null;
  if (!product) notFound();

  const images = (product.product_images ?? []).sort((a, b) => a.position - b.position);
  const updateAction = updateProduct.bind(null, product.id);
  const deleteAction = deleteProduct.bind(null, product.id);

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/produtos" className="mb-4 inline-block text-sm text-muted hover:text-fg">
        ← Produtos
      </Link>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-fg">{product.name_pt}</h1>
        <Link href={`/produto/${product.slug}`} className="text-sm text-brand-600 hover:underline" target="_blank">
          Ver na loja ↗
        </Link>
      </div>

      {/* Fotos */}
      <div className="card mb-6 space-y-4 p-6">
        <h2 className="text-lg font-semibold">Fotos</h2>
        {images.length === 0 ? (
          <p className="text-sm text-muted">Ainda não há fotos. Carrega a primeira abaixo.</p>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {images.map((img) => (
              <div key={img.id} className="group relative aspect-square overflow-hidden rounded-lg border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="h-full w-full object-cover" />
                <form action={deleteProductImage.bind(null, img.id, product.id)} className="absolute right-1 top-1">
                  <button
                    type="submit"
                    className="rounded bg-red-600/90 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100"
                    title="Remover foto"
                  >
                    ✕
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}

        <form action={uploadProductImage} className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
          <input type="hidden" name="product_id" value={product.id} />
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            className="text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-brand-600 file:px-3 file:py-2 file:text-white"
          />
          <button type="submit" className="btn-secondary">
            Carregar foto
          </button>
        </form>
      </div>

      {/* Detalhes */}
      <ProductForm action={updateAction} product={product} submitLabel="Guardar alterações" />

      {/* Apagar */}
      <div className="card mt-6 flex items-center justify-between border-sale/40 bg-sale/10 p-6">
        <div>
          <h3 className="font-semibold text-[#fda4b4]">Apagar produto</h3>
          <p className="text-sm text-muted">Esta ação é permanente e remove também as fotos.</p>
        </div>
        <form action={deleteAction}>
          <button type="submit" className="btn-danger">
            Apagar
          </button>
        </form>
      </div>
    </div>
  );
}
