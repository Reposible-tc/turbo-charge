"use server";

import Stripe from "stripe";
import { Tables } from "../supabase/types";
import { createClient } from "../supabase/server";
import { stripe } from "./config";
import { calculateTrialEndUnixTimestamp } from "@/utils/calculate-trial-end-unix-timestamp";
import { getURL } from "@/utils/get-url";
import { createOrRetrieveCustomer } from "@/features/payments/queries/customer-queries";

type Price = Tables<"prices">;
type Product = Tables<"products">;

type CheckoutResponse = {
  errorRedirect?: string;
  sessionUrl?: Stripe.Checkout.Session["url"];
};

export async function checkoutWithStripe(
  product: Product,
  price: Price,
  redirectPath: string = "/payment-success"
): Promise<CheckoutResponse> {
  // Get the user from Supabase auth
  const supabase = await createClient();
  const {
    error,
    data: { user },
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.error(error);
    throw new Error("Could not get user session.");
  }

  // Retrieve or create the customer in Stripe
  let customer: string;
  try {
    customer = await createOrRetrieveCustomer({
      uuid: user?.id || "",
      email: user?.email || "",
    });
  } catch (err) {
    console.error(err);
    throw new Error("Unable to access customer record.");
  }

  let params: Stripe.Checkout.SessionCreateParams = {
    allow_promotion_codes: true,
    billing_address_collection: "required",
    customer,
    customer_update: {
      address: "auto",
    },
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    cancel_url: getURL(),
    success_url: getURL(redirectPath),
  };

  if (price.type === "recurring") {
    params = {
      ...params,
      mode: "subscription",
      subscription_data: {
        trial_end: calculateTrialEndUnixTimestamp(price.trial_period_days),
      },
    };
  } else if (price.type === "one_time") {
    params = {
      ...params,
      mode: "payment",
      metadata: {
        product_id: product.id,
      },
    };
  }

  // Create a checkout session in Stripe
  let session;
  try {
    session = await stripe.checkout.sessions.create(params);
  } catch (err) {
    console.error(err);
    throw new Error("Unable to create checkout session.");
  }

  // Instead of returning a Response, just return the data or error.
  if (session) {
    return { sessionUrl: session.url };
  } else {
    throw new Error("Unable to create checkout session.");
  }
}

export async function createStripePortal() {
  const supabase = await createClient();
  const {
    error,
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (error) {
      console.error(error);
    }
    throw new Error("Could not get user session.");
  }

  let customer;
  try {
    customer = await createOrRetrieveCustomer({
      uuid: user.id || "",
      email: user.email || "",
    });
  } catch (err) {
    console.error(err);
    throw new Error("Unable to access customer record.");
  }

  if (!customer) {
    throw new Error("Could not get customer.");
  }

  try {
    const { url } = await stripe.billingPortal.sessions.create({
      customer,
      return_url: getURL("/account"),
    });
    if (!url) {
      throw new Error("Could not create billing portal");
    }
    return url;
  } catch (err) {
    console.error(err);
    throw new Error("Could not create billing portal");
  }
}
