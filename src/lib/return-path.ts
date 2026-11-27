import type { Locale } from "@/i18n/config";

/*
 * Where to go after signing in. `next` comes from the URL, so it is untrusted: accept only a path
 * on this site inside the active locale, otherwise fall back to the account page. Client-safe.
 */
export function safeReturnPath(next: string | null, locale: Locale): string {
  const fallback = `/${locale}/account`;
  if (!next || !next.startsWith("/") || next.includes("//") || next.includes("\\")) return fallback;
  const base = "http://local.invalid";
  let url: URL;
  try {
    url = new URL(next, base);
  } catch {
    return fallback;
  }
  if (url.origin !== base) return fallback;
  if (url.pathname !== `/${locale}` && !url.pathname.startsWith(`/${locale}/`)) return fallback;
  return `${url.pathname}${url.search}${url.hash}`;
}
