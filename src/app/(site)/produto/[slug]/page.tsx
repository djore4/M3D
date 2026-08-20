import { notFound } from "next/navigation";
import ProductView from "@/components/ProductView";
import { getProductBySlug } from "@/lib/data";

export const revalidate = 60;

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();
  return <ProductView product={product} />;
}
