import type { Dictionary } from "@/i18n/dictionaries";

/*
 * Sample clinic data for the homepage until the database exists.
 * Replaced by src/lib/services.ts (services) and the working_hours table (hours).
 * Visible text for each entry lives in the dictionaries, keyed by slug.
 */

export type ServiceSlug = keyof Dictionary["home"]["services"]["items"];

export const sampleServices: {
  slug: ServiceSlug;
  durationMinutes: number;
  priceCents: number;
}[] = [
  { slug: "checkup", durationMinutes: 30, priceCents: 20000 },
  { slug: "hygiene", durationMinutes: 45, priceCents: 30000 },
  { slug: "fillings", durationMinutes: 45, priceCents: 35000 },
  { slug: "whitening", durationMinutes: 60, priceCents: 120000 },
  { slug: "implants", durationMinutes: 60, priceCents: 25000 },
  { slug: "emergency", durationMinutes: 30, priceCents: 25000 },
];

// ISO day of week (1 = Monday). Clinic wall-clock time, Europe/Warsaw. null = closed.
export const sampleHours: { dayOfWeek: number; opens: string | null; closes: string | null }[] = [
  { dayOfWeek: 1, opens: "08:00", closes: "18:00" },
  { dayOfWeek: 2, opens: "08:00", closes: "18:00" },
  { dayOfWeek: 3, opens: "10:00", closes: "20:00" },
  { dayOfWeek: 4, opens: "08:00", closes: "18:00" },
  { dayOfWeek: 5, opens: "08:00", closes: "16:00" },
  { dayOfWeek: 6, opens: "09:00", closes: "13:00" },
  { dayOfWeek: 7, opens: null, closes: null },
];

// Proper nouns and contact details, identical in every locale.
export const sampleContact = {
  street: "ul. Przykładowa 12",
  city: "00-001 Warszawa",
  phone: "+48 22 000 00 00",
  phoneHref: "tel:+48220000000",
  email: "hello@example.com",
};
