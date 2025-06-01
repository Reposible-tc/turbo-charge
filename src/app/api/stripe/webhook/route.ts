import Email from "@/email/templates/payment-receipt";
import { manageNewPayment } from "@/features/payments/queries/payment-queries";
import {
  deletePriceQuery,
  upsertPriceQuery,
} from "@/features/prices/queries/price-queries";
import {
  deleteProductQuery,
  upsertProductQuery,
} from "@/features/products/queries/product-queries";
import { manageSubscriptionStatusChange } from "@/features/subscriptions/queries/subscription-queries";
import { resend } from "@/lib/resend/client";
import { verifyWebhook } from "@/lib/stripe/verify";
import Stripe from "stripe";

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "product.deleted",
  "price.created",
  "price.updated",
  "price.deleted",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(req: Request) {
  let event: Stripe.Event;

  try {
    event = await verifyWebhook(req);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`❌ Error message: ${error.message}`);
      return new Response(`Webhook Error: ${error.message}`, { status: 400 });
    }

    console.error(`❌ Error message: Unknown error`);
    return new Response(`Webhook Error: Unknown error`, { status: 500 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "product.created":
        case "product.updated":
          await upsertProductQuery(event.data.object as Stripe.Product);
          break;
        case "price.created":
        case "price.updated":
          await upsertPriceQuery(event.data.object as Stripe.Price);
          break;
        case "price.deleted":
          await deletePriceQuery(event.data.object as Stripe.Price);
          break;
        case "product.deleted":
          await deleteProductQuery(event.data.object as Stripe.Product);
          break;
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscription = event.data.object as Stripe.Subscription;
          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            event.type === "customer.subscription.created"
          );
          break;
        case "checkout.session.completed":
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === "subscription") {
            const subscriptionId = checkoutSession.subscription;
            await manageSubscriptionStatusChange(
              subscriptionId as string,
              checkoutSession.customer as string,
              true
            );
          } else if (checkoutSession.mode === "payment") {
            const paymentId = checkoutSession.payment_intent;
            const productId = checkoutSession.metadata?.product_id;
            const createdPayment = await manageNewPayment(
              productId,
              paymentId as string,
              checkoutSession.customer as string
            );

            if (!checkoutSession.customer_details?.email) {
              throw new Error("Customer email not found");
            }

            await resend.emails.send({
              from: "Reposible <purchase@email.reposible.com>",
              to: [checkoutSession.customer_details.email],
              subject: "Thank you for your purchase",
              react: Email(createdPayment) as React.ReactElement,
            });
          }
          break;
        default:
          throw new Error("Unhandled relevant event!");
      }
    } catch (error) {
      console.error(error);
      return new Response(
        "Webhook handler failed. View your Next.js function logs.",
        {
          status: 400,
        }
      );
    }
  } else {
    return new Response(`Unsupported event type: ${event.type}`, {
      status: 400,
    });
  }
  return new Response(JSON.stringify({ received: true }));
}
