import { stripe } from "@/lib/stripe/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { TablesInsert } from "@/lib/supabase/types";
import { toDateTime } from "@/utils/to-date-time";
import Stripe from "stripe";

export async function getSubscriptionsQuery() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*, prices(*, products(*))")
    .in("status", ["trialing", "active"])
    .maybeSingle();

  if (!data || error) {
    throw new Error(error?.message || `No subscription was found`);
  }

  return data;
}

export async function manageSubscriptionStatusChange(
  subscriptionId: string,
  customerId: string,
  createAction = false
) {
  const supabaseAdmin = await createAdminClient();

  // Get customer's UUID from mapping table.
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from("customers")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (noCustomerError)
    throw new Error(`Customer lookup failed: ${noCustomerError.message}`);

  const { id: uuid } = customerData!;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"],
  });

  // Upsert the latest status of the subscription object.
  const subscriptionData: TablesInsert<"subscriptions"> = {
    id: subscription.id,
    user_id: uuid,
    metadata: subscription.metadata,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
    quantity: subscription.items.data[0].quantity,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at
      ? toDateTime(subscription.cancel_at).toISOString()
      : null,
    canceled_at: subscription.canceled_at
      ? toDateTime(subscription.canceled_at).toISOString()
      : null,
    current_period_start: toDateTime(
      subscription.items.data[0].current_period_start
    ).toISOString(),
    current_period_end: toDateTime(
      subscription.items.data[0].current_period_end
    ).toISOString(),
    created: toDateTime(subscription.created).toISOString(),
    ended_at: subscription.ended_at
      ? toDateTime(subscription.ended_at).toISOString()
      : null,
    trial_start: subscription.trial_start
      ? toDateTime(subscription.trial_start).toISOString()
      : null,
    trial_end: subscription.trial_end
      ? toDateTime(subscription.trial_end).toISOString()
      : null,
  };

  const { error: upsertError } = await supabaseAdmin
    .from("subscriptions")
    .upsert([subscriptionData]);
  if (upsertError)
    throw new Error(
      `Subscription insert/update failed: ${upsertError.message}`
    );

  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  if (createAction && subscription.default_payment_method && uuid)
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod
    );
}

export async function copyBillingDetailsToCustomer(
  uuid: string,
  payment_method: Stripe.PaymentMethod
) {
  const supabaseAdmin = await createAdminClient();

  //Todo: check this assertion
  const customer = payment_method.customer as string;
  const {
    name,
    phone,
    address: billingAddress,
  } = payment_method.billing_details;
  if (!name || !phone || !billingAddress) return;
  const address: Stripe.AddressParam = {
    line1: billingAddress.line1 ?? undefined,
    line2: billingAddress.line2 ?? undefined,
    city: billingAddress.city ?? undefined,
    state: billingAddress.state ?? undefined,
    postal_code: billingAddress.postal_code ?? undefined,
    country: billingAddress.country ?? undefined,
  };
  await stripe.customers.update(customer, { name, phone, address });
  const { error: updateError } = await supabaseAdmin
    .from("users")
    .update({
      billing_address: { ...address },
      payment_method: { ...payment_method[payment_method.type] },
    })
    .eq("id", uuid);
  if (updateError)
    throw new Error(`Customer update failed: ${updateError.message}`);
}
