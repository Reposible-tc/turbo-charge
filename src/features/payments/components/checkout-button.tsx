"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Tables } from "@/lib/supabase/types";
import { handleStripeCheckout } from "../actions";

type Product = Tables<"products">;
type Price = Tables<"prices">;

interface ProductWithPrices extends Product {
  prices: Price[];
}

interface CheckoutButtonProps {
  product: ProductWithPrices | null;
}

export default function CheckoutButton({ product }: CheckoutButtonProps) {
  if (!product?.prices || product.prices.length === 0) {
    return null;
  }

  const price = product.prices[0];
  const unitAmount = price.unit_amount;
  const label = unitAmount
    ? `Get early access – € ${(unitAmount / 100).toFixed(2).replace(".", ",")}`
    : "Get early access";

  return (
    <Button
      type="submit"
      className="w-full"
      onClick={() => handleStripeCheckout(product, price)}
    >
      {label}
    </Button>
  );
}
