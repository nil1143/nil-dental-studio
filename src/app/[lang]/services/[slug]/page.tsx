import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { fill } from "@/i18n/fill";
import { formatPrice } from "@/lib/format";
import { getService, getServiceSlugs } from "@/lib/services";

// Every active slug is prerendered; any other slug renders the 404 page. Needs a seeded DB at build time.
export async function generateStaticParams() {
  return (await getServiceSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/services/[slug]">): Promise<Metadata> {
  const [locale, { slug }, { services }] = await Promise.all([getLocale(), params, getDictionary()]);
  const service = await getService(locale, slug);
  if (!service) return {};
  return { title: fill(services.detail.metaTitle, { name: service.name }), description: service.description };
}

export default async function ServicePage({ params }: PageProps<"/[lang]/services/[slug]">) {
  const [locale, { slug }, { services, common }] = await Promise.all([getLocale(), params, getDictionary()]);
  const service = await getService(locale, slug);
  if (!service) notFound();

  const t = services.detail;

  return (
    <article aria-labelledby="service-title" className="pt-10 pb-(--section-space) md:pt-16">
      <div className="shell">
        <Link href={`/${locale}/services`} className="link text-small text-ink-muted">
          <span aria-hidden="true">← </span>
          {t.back}
        </Link>

        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <header className="lg:col-span-7">
            <Image src={`/services/${service.slug}.svg`} alt="" width={72} height={72} />
            <h1 id="service-title" className="mt-6">
              {service.name}
            </h1>
            <p className="lead measure mt-5">{service.description}</p>
          </header>

          {/* Summary card: after the intro on phones, in the right column (and sticky) on desktop. */}
          <aside
            aria-labelledby="service-summary"
            className="max-w-md lg:col-span-5 lg:row-span-2 lg:max-w-none lg:self-start lg:sticky lg:top-28"
          >
            <div className="card p-7 md:p-8">
              <h2 id="service-summary" className="label">
                {t.summaryTitle}
              </h2>
              <dl className="mt-5 divide-y divide-line border-y border-line">
                <div className="flex items-baseline justify-between gap-4 py-4">
                  <dt className="text-ink-muted">{services.durationLabel}</dt>
                  <dd>{fill(services.duration, { minutes: service.durationMinutes })}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-4">
                  <dt className="text-ink-muted">{services.priceLabel}</dt>
                  <dd className="font-medium">
                    {fill(services.price, { price: formatPrice(service.priceCents, locale) })}
                  </dd>
                </div>
              </dl>
              {/* Booking is not built yet: this button intentionally does nothing. */}
              <button type="button" className="btn btn-primary mt-7 w-full">
                {common.bookVisit}
              </button>
            </div>
          </aside>

          <div className="lg:col-span-7">
            <section aria-labelledby="service-about">
              <h2 id="service-about" className="text-h3">
                {t.aboutTitle}
              </h2>
              <div className="measure mt-4 space-y-4 text-ink-muted">
                {service.details.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>

            <hr className="rule my-10" />

            <section aria-labelledby="service-expect">
              <h2 id="service-expect" className="text-h3">
                {t.expectTitle}
              </h2>
              <ol className="mt-6 grid gap-4">
                {service.expect.map((item, index) => (
                  <li key={item} className="flex gap-4">
                    <span aria-hidden="true" className="font-display text-h3 leading-none text-primary tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="pt-0.5">{item}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </div>
    </article>
  );
}
