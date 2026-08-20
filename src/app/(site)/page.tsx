import HomeView from "@/components/HomeView";
import { getFeaturedProducts, getPromoProducts } from "@/lib/data";

export const revalidate = 60;

export default async function HomePage() {
  const [featured, promos] = await Promise.all([getFeaturedProducts(), getPromoProducts()]);
  return <HomeView featured={featured} promos={promos} />;
}
