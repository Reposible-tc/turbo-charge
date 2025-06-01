import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/types";

export type User = Database["public"]["Tables"]["users"]["Row"];

export async function getUserQuery() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .maybeSingle();

  if (!data || error) {
    throw new Error(error?.message || `No user was found`);
  }

  return data;
}
