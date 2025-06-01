// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { getEnvVar } from "@/utils/get-env-var";
import * as Sentry from "@sentry/nextjs";
import { supabaseIntegration } from "@supabase/sentry-js-integration";
import { SupabaseClient } from "@supabase/supabase-js";

Sentry.init({
  dsn: getEnvVar(process.env.NEXT_PUBLIC_SENTRY_DSN, "NEXT_PUBLIC_SENTRY_DSN"),
  integrations: [
    supabaseIntegration(SupabaseClient, Sentry, {
      tracing: true,
      breadcrumbs: true,
      errors: true,
    }),
    Sentry.nativeNodeFetchIntegration({
      breadcrumbs: true,
      ignoreOutgoingRequests: (url) => {
        return url.startsWith(
          `${getEnvVar(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            "NEXT_PUBLIC_SUPABASE_URL"
          )}/rest`
        );
      },
    }),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
