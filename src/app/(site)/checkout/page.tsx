import CheckoutView from "@/components/CheckoutView";
import { getShippingRates } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const rates = await getShippingRates();
  return <CheckoutView rates={rates} />;
}
