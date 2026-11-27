import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/fill";
import { formatPrice } from "@/lib/format";
import { getServices } from "@/lib/services";

// Card grid of services: name, description, duration and price. /services shows all; the homepage a `limit`.
export async function ServiceList({
  locale,
  dict,
  limit,
}: {
  locale: Locale;
  dict: Dictionary["services"];
  limit?: number;
}) {
  const services = await getServices(locale);
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.slice(0, limit).map((service) => (
        <li
          key={service.slug}
          className="card relative flex flex-col p-7 transition-colors duration-200 has-[a:hover]:border-line-strong has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-3 has-[a:focus-visible]:outline-primary md:p-8"
        >
          {/* Decorative: the title names the service. One pictogram per slug in public/services/. */}
          <Image src={`/services/${service.slug}.svg`} alt="" width={56} height={56} className="mb-6" />
          <h3>
            {/* Stretched link: the whole card is the click target, the title is its accessible name. */}
            <Link
              href={`/${locale}/services/${service.slug}`}
              className="after:absolute after:inset-0 after:rounded-card focus-visible:outline-none"
            >
              {service.name}
            </Link>
          </h3>
          <p className="mt-3 flex-1 text-ink-muted">{service.description}</p>
          <dl className="mt-7 flex items-baseline justify-between border-t border-line pt-5 text-small">
            <div>
              <dt className="sr-only">{dict.durationLabel}</dt>
              <dd className="text-ink-muted">
                {fill(dict.duration, { minutes: service.durationMinutes })}
              </dd>
            </div>
            <div>
              <dt className="sr-only">{dict.priceLabel}</dt>
              <dd className="font-medium">
                {fill(dict.price, { price: formatPrice(service.priceCents, locale) })}
              </dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}
