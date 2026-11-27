import { and, asc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { serviceTranslations, services } from "@/db/schema/clinic";
import { defaultLocale, type Locale } from "@/i18n/config";

/*
 * Service reads, cached: they hold no per-request data and change rarely.
 * Invalidate with the "services" tag. The locale is an argument so the cache key names it.
 */

const fallbackText = alias(serviceTranslations, "fallback_text");
const localeText = alias(serviceTranslations, "locale_text");

// Active services with text in `locale`, falling back to the default locale's row when it is missing.
function selectServices(locale: Locale) {
  return db
    .select({ service: services, fallback: fallbackText, localized: localeText })
    .from(services)
    .innerJoin(
      fallbackText,
      and(eq(fallbackText.serviceId, services.id), eq(fallbackText.locale, defaultLocale)),
    )
    .leftJoin(localeText, and(eq(localeText.serviceId, services.id), eq(localeText.locale, locale)))
    .$dynamic();
}

function toService({ service, fallback, localized }: Awaited<ReturnType<typeof selectServices>>[number]) {
  const text = localized ?? fallback;
  return {
    slug: service.slug,
    durationMinutes: service.durationMinutes,
    priceCents: service.priceCents,
    name: text.name,
    description: text.description,
    details: text.details,
    expect: text.expect,
  };
}

export type Service = ReturnType<typeof toService>;

export async function getServices(locale: Locale): Promise<Service[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("services");
  const rows = await selectServices(locale)
    .where(eq(services.active, true))
    .orderBy(asc(services.sortOrder), asc(services.slug));
  return rows.map(toService);
}

// One active service by URL slug, or null for an unknown or deactivated slug.
export async function getService(locale: Locale, slug: string): Promise<Service | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("services");
  const [row] = await selectServices(locale)
    .where(and(eq(services.slug, slug), eq(services.active, true)))
    .limit(1);
  return row ? toService(row) : null;
}

export async function getServiceSlugs(): Promise<string[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("services");
  const rows = await db.select({ slug: services.slug }).from(services).where(eq(services.active, true));
  return rows.map((row) => row.slug);
}
