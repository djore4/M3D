import type { Product } from "@/lib/types";

/**
 * Formulário partilhado para criar/editar um produto.
 * `action` é uma server action; funciona sem JavaScript no cliente.
 */
export default function ProductForm({
  action,
  product,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  product?: Product;
  submitLabel: string;
}) {
  const price = product ? (product.price_cents / 100).toFixed(2) : "";
  const promo =
    product?.promo_price_cents != null ? (product.promo_price_cents / 100).toFixed(2) : "";

  return (
    <form action={action} className="space-y-6">
      <div className="card space-y-4 p-6">
        <h2 className="text-lg font-semibold">Detalhes</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Nome (PT) *</label>
            <input name="name_pt" required className="input" defaultValue={product?.name_pt ?? ""} />
          </div>
          <div>
            <label className="label">Nome (EN)</label>
            <input name="name_en" className="input" defaultValue={product?.name_en ?? ""} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Slug (URL) — deixa vazio para gerar do nome</label>
            <input name="slug" className="input" defaultValue={product?.slug ?? ""} placeholder="ex: vaso-geometrico" />
          </div>
          <div>
            <label className="label">Descrição (PT)</label>
            <textarea
              name="description_pt"
              rows={4}
              className="input"
              defaultValue={product?.description_pt ?? ""}
            />
          </div>
          <div>
            <label className="label">Descrição (EN)</label>
            <textarea
              name="description_en"
              rows={4}
              className="input"
              defaultValue={product?.description_en ?? ""}
            />
          </div>
        </div>
      </div>

      <div className="card space-y-4 p-6">
        <h2 className="text-lg font-semibold">Preço e stock</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label">Preço (€) *</label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              className="input"
              defaultValue={price}
            />
          </div>
          <div>
            <label className="label">Preço promocional (€)</label>
            <input name="promo_price" type="number" step="0.01" min="0" className="input" defaultValue={promo} />
          </div>
          <div>
            <label className="label">Stock</label>
            <input name="stock" type="number" min="0" className="input" defaultValue={product?.stock ?? 0} />
          </div>
        </div>
        <div className="pt-2">
          <label className="label">Tamanhos disponíveis</label>
          <div className="flex flex-wrap gap-3">
            {["S", "M", "L"].map((s) => (
              <label
                key={s}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm"
              >
                <input type="checkbox" name="sizes" value={s} defaultChecked={product?.sizes?.includes(s) ?? false} />
                {s}
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-6 pt-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_promo" defaultChecked={product?.is_promo ?? false} />
            Em promoção
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_featured" defaultChecked={product?.is_featured ?? false} />
            Destaque
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="active" defaultChecked={product?.active ?? true} />
            Ativo (visível na loja)
          </label>
        </div>
      </div>

      <div className="card space-y-4 p-6">
        <h2 className="text-lg font-semibold">Referência de fotos</h2>
        <div>
          <label className="label">Link do álbum do Google Fotos (opcional, referência)</label>
          <input
            name="google_photos_url"
            type="url"
            className="input"
            placeholder="https://photos.app.goo.gl/..."
            defaultValue={product?.google_photos_url ?? ""}
          />
          <p className="mt-1 text-xs text-faint">
            As fotos apresentadas na loja são as carregadas abaixo. Este link fica guardado só como
            referência de gestão.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
