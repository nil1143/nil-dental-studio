import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  time,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
// Relative on purpose: drizzle-kit loads this file without the `@/` path alias.
import { locales } from "../../i18n/config";

export const localeEnum = pgEnum("locale", locales);

// A bookable service. Deactivate (`active = false`), never delete: appointments will reference it.
export const services = pgTable(
  "services",
  {
    id: uuid().primaryKey().defaultRandom(),
    // URL segment and pictogram file name (public/services/<slug>.svg).
    slug: text().notNull().unique(),
    durationMinutes: integer().notNull(),
    // Integer grosze; the currency is PLN in every locale.
    priceCents: integer().notNull(),
    active: boolean().notNull().default(true),
    sortOrder: integer().notNull(),
  },
  (t) => [
    check("services_slug_format", sql`${t.slug} ~ '^[a-z0-9]+(-[a-z0-9]+)*$'`),
    check("services_duration_positive", sql`${t.durationMinutes} > 0`),
    check("services_price_non_negative", sql`${t.priceCents} >= 0`),
  ],
);

// Visible text of a service, one complete row per locale. A missing locale falls back to `en`.
export const serviceTranslations = pgTable(
  "service_translations",
  {
    serviceId: uuid()
      .notNull()
      .references(() => services.id, { onDelete: "cascade" }),
    locale: localeEnum().notNull(),
    name: text().notNull(),
    description: text().notNull(),
    details: text().array().notNull(),
    expect: text().array().notNull(),
  },
  (t) => [primaryKey({ columns: [t.serviceId, t.locale] })],
);

export const servicesRelations = relations(services, ({ many }) => ({
  translations: many(serviceTranslations),
}));

export const serviceTranslationsRelations = relations(serviceTranslations, ({ one }) => ({
  service: one(services, { fields: [serviceTranslations.serviceId], references: [services.id] }),
}));

/*
 * Weekly opening hours as clinic wall-clock time (Europe/Warsaw), not instants, so they hold across DST.
 * Exactly 7 rows: migration 0001 inserts days 1–7 and a trigger forbids INSERT, DELETE and TRUNCATE.
 * Edit with UPDATE only. Both times null = closed.
 */
export const workingHours = pgTable(
  "working_hours",
  {
    id: uuid().primaryKey().defaultRandom(),
    // ISO day of week, 1 = Monday.
    dayOfWeek: smallint().notNull().unique("working_hours_day_of_week_unique"),
    opens: time({ precision: 0 }),
    closes: time({ precision: 0 }),
  },
  (t) => [
    check("working_hours_iso_day", sql`${t.dayOfWeek} BETWEEN 1 AND 7`),
    check("working_hours_open_close_pair", sql`(${t.opens} IS NULL) = (${t.closes} IS NULL)`),
    check("working_hours_opens_before_closes", sql`${t.opens} < ${t.closes}`),
  ],
);

// Instants when the clinic is unavailable. Only ever removes availability from working_hours.
export const blockedTimes = pgTable(
  "blocked_times",
  {
    id: uuid().primaryKey().defaultRandom(),
    startsAt: timestamp({ withTimezone: true }).notNull(),
    endsAt: timestamp({ withTimezone: true }).notNull(),
  },
  (t) => [check("blocked_times_valid_range", sql`${t.endsAt} > ${t.startsAt}`)],
);
