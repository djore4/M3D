import LineIcon, { iconForSlug } from "./LineIcon";
import type { Product } from "@/lib/types";

// Gradientes escuros estáveis por produto (escolhidos por hash do slug)
const GRADIENTS = [
  "linear-gradient(150deg,#241f45,#0e0e18)",
  "linear-gradient(150deg,#12303a,#0c0c16)",
  "linear-gradient(150deg,#2a1436,#0d0c17)",
  "linear-gradient(150deg,#1a2340,#0c0d16)",
  "linear-gradient(150deg,#33240f,#0e0d16)",
];

function gradientFor(slug: string): string {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
}

/**
 * Miniatura de produto: mostra a foto carregada, ou — na sua ausência — um
 * placeholder gráfico (gradiente escuro + grelha técnica + ícone de linha).
 */
export default function ProductThumb({
  product,
  alt,
  iconClassName = "h-1/3 w-1/3 text-brand-300",
}: {
  product: Product;
  alt: string;
  iconClassName?: string;
}) {
  const image = product.product_images?.[0]?.url ?? null;

  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt={alt} className="h-full w-full object-cover" />;
  }

  return (
    <div className="relative h-full w-full" style={{ background: gradientFor(product.slug) }}>
      <div className="techgrid absolute inset-0 opacity-60" />
      <div className="absolute inset-0 grid place-items-center">
        <LineIcon name={iconForSlug(product.slug)} className={iconClassName} />
      </div>
    </div>
  );
}
