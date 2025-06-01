import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { Tables } from "@/lib/supabase/types";
import Stripe from "stripe";

type Product = Tables<"products">;

export async function getProductsQuery() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, prices(*)")
    .eq("active", true)
    .eq("prices.active", true)
    .order("metadata->position")
    .order("unit_amount", { referencedTable: "prices" });

  if (!data || error) {
    throw new Error(error?.message || `No products were found`);
  }

  return data;
}

export async function getProductQuery(productName: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, prices(*)")
    .eq("active", true)
    .eq("prices.active", true)
    .order("metadata->position")
    .order("unit_amount", { referencedTable: "prices" })
    .eq("name", productName.charAt(0).toUpperCase() + productName.slice(1))
    .maybeSingle();

  if (!data || error) {
    throw new Error(error?.message || `No product was found`);
  }

  return data;
}

export async function upsertProductQuery(product: Stripe.Product) {
  const supabaseAdmin = await createAdminClient();

  const {
    id,
    active,
    name,
    description,
    images,
    metadata,
    marketing_features,
  } = product;

  const formattedMarkeringFeatures = JSON.stringify(marketing_features);

  const productData: Product = {
    id,
    active,
    name,
    description,
    image: images[0],
    metadata,
    marketing_features: formattedMarkeringFeatures,
  };

  const { error } = await supabaseAdmin.from("products").upsert([productData]);

  if (error) throw new Error(`Product insert/update failed: ${error.message}`);
}

export async function deleteProductQuery(product: Stripe.Product) {
  const supabaseAdmin = await createAdminClient();

  const { id } = product;

  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);

  if (error) throw new Error(`Product deletion failed: ${error.message}`);
}
