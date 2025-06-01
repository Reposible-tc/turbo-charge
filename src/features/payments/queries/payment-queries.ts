import { stripe } from "@/lib/stripe/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { TablesInsert } from "@/lib/supabase/types";

export async function getPaymentQuery(productId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("product_id", productId)
    .maybeSingle();

  if (error) {
    throw new Error(error?.message || `No payment was found`);
  }

  return data;
}

export async function manageNewPayment(
  productId: string | undefined,
  paymentId: string,
  customerId: string
){
  const supabaseAdmin = await createAdminClient();

  // Get customer's UUID from mapping table.
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from("customers")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (noCustomerError)
    throw new Error(`Customer lookup failed: ${noCustomerError.message}`);

  if (!productId) throw new Error(`Product ID is required for new payment.`);

  // Get customer's UUID from mapping table.
  const { data: productData, error: noProductError } = await supabaseAdmin
    .from("products")
    .select("id")
    .eq("id", productId)
    .single();

  if (noProductError)
    throw new Error(`Product lookup failed: ${noProductError.message}`);

  const payment = await stripe.paymentIntents.retrieve(paymentId);

  // Upsert the latest status of the subscription object.
  const paymentData: TablesInsert<"payments"> = {
    id: payment.id,
    user_id: customerData.id,
    product_id: productData.id,
    metadata: payment.metadata,
    quantity: payment.amount,
  };

  const { data, error: upsertError } = await supabaseAdmin
    .from("payments")
    .upsert(paymentData)
    .select("*, products(*, prices(*))")
    .maybeSingle();
  if (upsertError)
    throw new Error(`Payment insert/update failed: ${upsertError.message}`);

  if (!data) throw new Error(`Payment lookup failed: ${payment.id}`);

  return data;

  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  /*   if (createAction && payment.default_payment_method && uuid)
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod
    ); */
};
