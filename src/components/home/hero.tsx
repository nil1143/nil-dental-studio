import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function Hero({
  locale,
  dict,
  bookVisit,
}: {
  locale: Locale;
  dict: Dictionary["home"]["hero"];
  bookVisit: string;
}) {
  return (
    <section aria-labelledby="hero-title" className="pt-10 pb-(--section-space) md:pt-16">
      <div className="shell grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <p className="eyebrow">{dict.eyebrow}</p>
          <h1 id="hero-title" className="headline mt-5">
            {dict.title}
          </h1>
          <p className="lead measure mt-6">{dict.lead}</p>
          <div className="mt-9 grid gap-3 sm:flex sm:flex-wrap">
            <Link href={`/${locale}#services`} className="btn btn-primary">
              {bookVisit}
            </Link>
            <Link href={`/${locale}#visit`} className="btn btn-secondary">
              {dict.secondaryCta}
            </Link>
          </div>
          <ul className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-small text-ink-muted sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
            {dict.assurances.map((item) => (
              <li
                key={item}
                className="sm:border-l sm:border-line sm:pl-6 sm:first:border-l-0 sm:first:pl-0"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="media aspect-4/3 sm:aspect-landscape lg:col-span-5 lg:aspect-portrait">
          <Image
            src="/placeholders/treatment-room.svg"
            alt={dict.imageAlt}
            fill
            preload
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
