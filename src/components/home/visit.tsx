import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/fill";
import { sampleContact } from "@/lib/sample-clinic";
import { getWorkingHours } from "@/lib/working-hours";

export async function Visit({
  locale,
  dict,
  days,
  bookVisit,
}: {
  locale: Locale;
  dict: Dictionary["home"]["visit"];
  days: string[];
  bookVisit: string;
}) {
  const hours = await getWorkingHours();
  return (
    <section id="visit" aria-labelledby="visit-title" className="section bg-mist">
      <div className="shell">
        <SectionHeading id="visit-title" eyebrow={dict.eyebrow} title={dict.title} />
        <div className="mt-12 grid gap-5 lg:mt-16 lg:grid-cols-2">
          <div className="card flex flex-col p-7 md:p-8">
            <h3>{dict.hoursTitle}</h3>
            <dl className="mt-6 lg:mt-8">
              {hours.map((day) => (
                <div
                  key={day.dayOfWeek}
                  className="flex justify-between gap-4 border-b border-line py-3 last:border-b-0 lg:py-4"
                >
                  <dt>{days[day.dayOfWeek - 1]}</dt>
                  <dd className={day.opens ? "tabular-nums" : "text-ink-muted"}>
                    {day.opens && day.closes
                      ? fill(dict.timeRange, { opens: day.opens, closes: day.closes })
                      : dict.closed}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-auto border-t border-line pt-6 text-small text-ink-muted">
              {dict.hoursNote}
            </p>
          </div>

          <div className="card flex flex-col overflow-hidden">
            <div className="relative aspect-wide bg-mist lg:aspect-21/9">
              <Image
                src="/placeholders/map.svg"
                alt={dict.mapAlt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col p-7 md:p-8">
              <h3>{dict.locationTitle}</h3>
              <dl className="mt-6 grid gap-5 sm:grid-cols-3">
                <div>
                  <dt className="label">{dict.addressLabel}</dt>
                  <dd className="mt-1.5">
                    {sampleContact.street}
                    <br />
                    {sampleContact.city}
                  </dd>
                </div>
                <div>
                  <dt className="label">{dict.phoneLabel}</dt>
                  <dd className="mt-1.5">
                    <a href={sampleContact.phoneHref} className="link whitespace-nowrap">
                      {sampleContact.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="label">{dict.emailLabel}</dt>
                  <dd className="mt-1.5">
                    <a href={`mailto:${sampleContact.email}`} className="link">
                      {sampleContact.email}
                    </a>
                  </dd>
                </div>
              </dl>
              <p className="mt-6 text-small text-ink-muted">{dict.directions}</p>
              <div className="mt-auto pt-8">
                <Link href={`/${locale}#services`} className="btn btn-primary">
                  {bookVisit}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
