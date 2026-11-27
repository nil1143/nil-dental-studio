import "server-only";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { getLocale } from "@/i18n/dictionaries";
import { auth, type Role } from "./auth";

/*
 * The only way pages read auth. Every call reads the request, so callers render inside <Suspense>.
 * Deliberately uncached (no "use cache" of any kind): sign-out and role changes apply on the next
 * request. React `cache` only dedupes the lookup within one render.
 */
const getSession = cache(async () => auth.api.getSession({ headers: await headers() }));

export type SessionUser = { id: string; name: string; email: string; role: Role };

/** Signed-in user, or a redirect to sign-in that returns to `path` (locale-less, e.g. "/account"). */
export async function requireUser(path: `/${string}`): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    const locale = await getLocale();
    redirect(`/${locale}/sign-in?next=${encodeURIComponent(`/${locale}${path}`)}`);
  }
  const { id, name, email, role } = session.user;
  return { id, name, email, role: role as Role };
}

/** Signed-in admin. Anyone else gets the 404 page, so the admin area is not advertised. */
export async function requireAdmin(path: `/${string}`): Promise<SessionUser> {
  const user = await requireUser(path);
  if (user.role !== "admin") notFound();
  return user;
}
