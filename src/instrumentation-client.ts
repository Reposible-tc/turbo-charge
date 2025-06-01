// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { supabaseIntegration } from "@supabase/sentry-js-integration";
import { SupabaseClient } from "@supabase/supabase-js";
import { getEnvVar } from "./utils/get-env-var";

Sentry.init({
  dsn: getEnvVar(process.env.NEXT_PUBLIC_SENTRY_DSN, "NEXT_PUBLIC_SENTRY_DSN"),

  // Add optional integrations for additional features
  integrations: [
    supabaseIntegration(SupabaseClient, Sentry, {
      tracing: true,
      breadcrumbs: true,
      errors: true,
    }),
    Sentry.browserTracingIntegration({
      shouldCreateSpanForRequest: (url) => {
        return !url.startsWith(
          `${getEnvVar(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            "NEXT_PUBLIC_SUPABASE_URL"
          )}/rest`
        );
      },
    }),
    Sentry.replayIntegration(),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
