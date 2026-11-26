import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function SiteHeader({ locale, dict }: { locale: Locale; dict: Dictionary["common"] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="shell flex h-16 items-center justify-between gap-4 md:h-20">
        <Link
          href={`/${locale}`}
          aria-label={dict.homeLink}
          className="font-display text-h3"
        >
          {dict.brand}
        </Link>
        <Link href={`/${locale}#services`} className="btn btn-primary">
          {dict.bookVisit}
        </Link>
      </div>
    </header>
  );
}
