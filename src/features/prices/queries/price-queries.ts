import { createAdminClient } from "@/lib/supabase/admin";
import { Tables } from "@/lib/supabase/types";
import Stripe from "stripe";

type Price = Tables<"prices">;

// Change to control trial period length
const TRIAL_PERIOD_DAYS = 0;

export async function upsertPriceQuery(price: Stripe.Price) {
  const supabaseAdmin = await createAdminClient();

  const {
    id,
    active,
    currency,
    type,
    unit_amount,
    recurring,
    nickname,
    metadata,
  } = price;

  const interval = recurring?.interval ?? null;
  const interval_count = recurring?.interval_count ?? null;
  const trial_period_days = recurring?.trial_period_days ?? TRIAL_PERIOD_DAYS;
  const description = nickname;

  const priceData: Price = {
    id,
    product_id: typeof price.product === "string" ? price.product : "",
    active,
    currency,
    type,
    unit_amount,
    interval,
    interval_count,
    trial_period_days,
    description,
    metadata,
  };

  const { error } = await supabaseAdmin.from("prices").upsert([priceData]);

  if (error) {
    throw new Error(`Price insert/update failed: ${error.message}`);
  }
}

export async function deletePriceQuery(price: Stripe.Price) {
  const supabaseAdmin = await createAdminClient();

  const { id } = price;

  const { error } = await supabaseAdmin.from("prices").delete().eq("id", id);

  if (error) throw new Error(`Price deletion failed: ${error.message}`);
}
