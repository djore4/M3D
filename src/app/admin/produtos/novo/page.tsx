import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";
import { createProduct } from "../actions";

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/produtos" className="mb-4 inline-block text-sm text-muted hover:text-fg">
        ← Produtos
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-fg">Novo produto</h1>
      <p className="mb-6 text-sm text-muted">
        Guarda o produto primeiro; depois poderás carregar as fotos na página de edição.
      </p>
      <ProductForm action={createProduct} submitLabel="Criar produto" />
    </div>
  );
}
