import type { Locale } from "@/i18n/config";

const intlLocale: Record<Locale, string> = { en: "en-GB", pl: "pl-PL" };

// The only money formatter. Amounts are integer grosze; currency is PLN in every locale.
export function formatPrice(grosze: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale[locale], {
    style: "currency",
    currency: "PLN",
    trailingZeroDisplay: "stripIfInteger",
  }).format(grosze / 100);
}
