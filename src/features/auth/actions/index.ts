"use server";
import { localeRedirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { Provider } from "@supabase/supabase-js";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";

async function getBaseUrl() {
  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL is not defined, please set it in your environment variables for each environment."
    );
  }

  const locale = await getLocale();

  return `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}`;
}

export async function getCurrentAuthUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    await localeRedirect(`/login?error=${error.message}`);
  }

  if (!data?.user) {
    await localeRedirect("/login");
  }

  return data.user;
}

export async function requireNoCurrentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data && data.user) {
    await localeRedirect("/");
  }
}

export async function loginWithOAuth(provider: Provider) {
  const supabase = await createClient();
  const baseUrl = await getBaseUrl();

  const redirectTo = `${baseUrl}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
    },
  });

  if (error) {
    await localeRedirect(`/login?error=${error.message}`);
  }

  if (data.url) {
    await localeRedirect(data.url);
  }

  revalidatePath("/", "layout");
  await localeRedirect("/");
}

export async function loginWithOTP(formData: FormData) {
  const supabase = await createClient();
  const baseUrl = await getBaseUrl();

  const { error } = await supabase.auth.signInWithOtp({
    email: formData.get("email") as string,
    options: {
      // set this to false if you do not want the user to be automatically signed up
      shouldCreateUser: true,
      emailRedirectTo: baseUrl,
    },
  });

  if (error) {
    await localeRedirect(`/login?error=${error.message}`);
  }

  revalidatePath("/", "layout");
  await localeRedirect("/login/otp-success");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    await localeRedirect(`/login?error=${error.message}`);
  }

  revalidatePath("/", "layout");
  await localeRedirect("/");
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    await localeRedirect(`/login?error=${error.message}`);
  }

  revalidatePath("/", "layout");
  await localeRedirect("/");
}

export async function logOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    await localeRedirect(`/login?error=${error.message}`);
  }

  revalidatePath("/", "layout");
  await localeRedirect("/");
}
