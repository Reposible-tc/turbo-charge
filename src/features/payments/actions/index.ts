"use server";
import { checkoutWithStripe } from "@/lib/stripe/server";
import { Tables } from "@/lib/supabase/types";
import { redirect } from "next/navigation";

type Price = Tables<"prices">;
type Product = Tables<"products">;

export const handleStripeCheckout = async (product: Product, price: Price) => {
  const { errorRedirect, sessionUrl } = await checkoutWithStripe(
    product,
    price
  );

  if (errorRedirect) {
    return redirect(errorRedirect);
  }

  if (!sessionUrl) {
    throw new Error("Stripe session URL is not available.");
  }

  return redirect(sessionUrl);
};
