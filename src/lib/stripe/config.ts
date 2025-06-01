import Stripe from "stripe";
import packageInfo from "@/../package.json";
import { getEnvVar } from "@/utils/get-env-var";
import { APPLICATION_NAME, WEBSITE_URL } from "@/utils/constants";

export const stripe = new Stripe(
  getEnvVar(process.env.STRIPE_SECRET_KEY, "STRIPE_SECRET_KEY"),
  {
    apiVersion: "2025-04-30.basil",
    // Register this as an official Stripe plugin.
    // https://stripe.com/docs/building-plugins#setappinfo
    appInfo: {
      name: APPLICATION_NAME,
      version: packageInfo.version,
      url: WEBSITE_URL,
    },
  }
);
