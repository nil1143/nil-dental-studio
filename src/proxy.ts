import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, locales, type Locale } from "@/i18n/config";

// Highest-q language from Accept-Language that we support, else the default.
function preferredLocale(header: string | null): Locale {
  const ranked = (header ?? "")
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { base: tag.toLowerCase().split("-")[0], q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  const match = ranked.find((l) => hasLocale(l.base));
  return match ? (match.base as Locale) : defaultLocale;
}

// /{locale}/account/** and /{locale}/admin/** need a signed-in user.
const protectedPath = new RegExp(`^/(${locales.join("|")})/(account|admin)(/|$)`);

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasLocalePrefix = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );

  if (hasLocalePrefix) {
    // Convenience only: a missing cookie skips straight to sign-in with a real redirect. The
    // security check is requireUser()/requireAdmin() in the page, since a cookie can be forged.
    const locale = protectedPath.exec(pathname)?.[1];
    if (locale && !getSessionCookie(request)) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/sign-in`;
      url.search = `?next=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(url);
    }
    return;
  }

  const locale = preferredLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip api/**, Next internals and files with an extension (favicon, public assets).
  matcher: ["/((?!api(?:/|$)|_next|.*\\..*).*)"],
};
