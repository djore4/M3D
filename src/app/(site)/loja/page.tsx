import ShopView from "@/components/ShopView";
import { getProducts } from "@/lib/data";

export const revalidate = 60;

export default async function ShopPage() {
  const products = await getProducts();
  return <ShopView products={products} />;
}
