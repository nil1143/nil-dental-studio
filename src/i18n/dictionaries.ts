import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import type en from "./dictionaries/en.json";
import { hasLocale, type Locale } from "./config";

export type Dictionary = typeof en;

// English is the source of truth for the shape; every locale must match it.
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  pl: () => import("./dictionaries/pl.json").then((m) => m.default),
};

// Server Components only: `lang()` does not work in Server Actions or Route Handlers.
export const getDictionary = async () => {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();
  return dictionaries[locale]();
};
