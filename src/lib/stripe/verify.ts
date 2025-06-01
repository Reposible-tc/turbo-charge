import { getEnvVar } from "@/utils/get-env-var";
import stripe from "stripe";
import Stripe from "stripe";

export async function verifyWebhook(req: Request): Promise<Stripe.Event> {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");
  const secret = getEnvVar(
    process.env.STRIPE_WEBHOOK_SECRET,
    "STRIPE_WEBHOOK_SECRET"
  );

  if (!signature) throw new Error("Missing Stripe signature header");

  try {
    const event = stripe.webhooks.constructEvent(payload, signature, secret);
    return event;
  } catch (err) {
    throw new Error((err as Error).message);
  }
}
