import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getEnvVar } from "@/utils/get-env-var";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(
  request: NextRequest,
  response: NextResponse
) {
  const supabase = createServerClient(
    getEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
    getEnvVar(
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    ),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Extract locale using next-intl's routing config
  const pathname = request.nextUrl.pathname;
  const localeMatch = pathname.match(/^\/(nl|en|fr)/); // Matches supported locales
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;

  const loginPath = getPathname({ href: "/login", locale });
  const otpSuccessPath = getPathname({
    href: "/login/otp-success",
    locale,
  });
  const authCallback = getPathname({ href: "/auth/callback", locale });
  const authConfirm = getPathname({ href: "/auth/confirm", locale });

  const loginUrl = new URL(loginPath, request.nextUrl.origin).toString();

  if (
    !user &&
    pathname !== loginPath &&
    pathname !== otpSuccessPath &&
    pathname !== authCallback &&
    pathname !== authConfirm
  ) {
    // no user, potentially respond by redirecting the user to the login page
    return NextResponse.redirect(loginUrl);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return response;
}
