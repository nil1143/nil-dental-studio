import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import en from "./dictionaries/en.json";
import { hasLocale, type Locale } from "./config";

export type Dictionary = typeof en;

// Any subset of the English shape. Arrays are replaced whole, never merged item by item.
type PartialDictionary<T> = {
  [K in keyof T]?: T[K] extends readonly unknown[]
    ? T[K]
    : T[K] extends object
      ? PartialDictionary<T[K]>
      : T[K];
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Overlay a translation on English, so untranslated keys fall back to English text.
function withFallback<T>(base: T, overlay: PartialDictionary<T>): T {
  if (!isPlainObject(base) || !isPlainObject(overlay)) return base;
  const result: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(overlay)) {
    if (value === undefined) continue;
    result[key] = isPlainObject(value) ? withFallback(result[key], value) : value;
  }
  return result as T;
}

// English is the source of truth for the shape; other locales may be partial while being translated.
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: async () => en,
  pl: () =>
    import("./dictionaries/pl.json").then((m) =>
      withFallback<Dictionary>(en, m.default satisfies PartialDictionary<Dictionary>),
    ),
};

// Server Components only: `lang()` does not work in Server Actions or Route Handlers.
export const getLocale = async (): Promise<Locale> => {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();
  return locale;
};

export const getDictionary = async () => dictionaries[await getLocale()]();
