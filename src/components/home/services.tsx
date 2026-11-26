import { SectionHeading } from "@/components/section-heading";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/fill";
import { formatPrice } from "@/lib/format";
import { sampleServices } from "@/lib/sample-clinic";

export function Services({ locale, dict }: { locale: Locale; dict: Dictionary["home"]["services"] }) {
  return (
    <section id="services" aria-labelledby="services-title" className="pb-(--section-space)">
      <div className="shell">
        <SectionHeading id="services-title" eyebrow={dict.eyebrow} title={dict.title} lead={dict.lead} />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {sampleServices.map((service) => {
            const text = dict.items[service.slug];
            return (
              <li key={service.slug} className="card flex flex-col p-7 md:p-8">
                <h3>{text.name}</h3>
                <p className="mt-3 flex-1 text-ink-muted">{text.description}</p>
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
            );
          })}
        </ul>
      </div>
    </section>
  );
}
