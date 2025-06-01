import { createClient } from "@supabase/supabase-js";
import { Database } from "./types";
import { getEnvVar } from "@/utils/get-env-var";

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!
export async function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("Do not use service role key on the client!");
  }

  return createClient<Database>(
    getEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
    getEnvVar(
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      "SUPABASE_SERVICE_ROLE_KEY"
    )
  );
}
