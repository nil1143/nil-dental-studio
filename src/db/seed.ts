/*
 * Idempotent sample data: `npm run db:seed` (after `db:migrate`). Safe to run repeatedly.
 * Prices, durations and hours are invented. English text only; Polish rows come in the Polish pass.
 */
import { eq, sql } from "drizzle-orm";
import { db } from "./index";
import { serviceTranslations, services, workingHours } from "./schema/clinic";

type SeedService = {
  slug: string;
  durationMinutes: number;
  priceCents: number;
  en: { name: string; description: string; details: string[]; expect: string[] };
};

// Listed in display order.
const seedServices: SeedService[] = [
  {
    "slug": "checkup",
    "durationMinutes": 30,
    "priceCents": 20000,
    "en": {
      "name": "Check-up and consultation",
      "description": "A full examination, a clear explanation of what we see and a plan you can take home.",
      "details": [
        "Your first visit, or your regular one. We look at your teeth, gums and bite, take digital X-rays if they are needed, and tell you plainly what we see.",
        "You leave with a written plan in order of priority, with the cost of each step, so you can decide what to do and when."
      ],
      "expect": [
        "A short conversation about your health and any concerns",
        "A full examination of teeth, gums and bite",
        "Digital X-rays only where they add something",
        "A written plan with costs, in order of priority"
      ]
    }
  },
  {
    "slug": "hygiene",
    "durationMinutes": 45,
    "priceCents": 30000,
    "en": {
      "name": "Hygiene and cleaning",
      "description": "Scaling, polishing and practical advice to keep your gums healthy between visits.",
      "details": [
        "A thorough clean by our hygienist to remove tartar and staining that brushing at home cannot reach.",
        "We take our time, explain what we are doing as we go, and show you simple ways to look after your gums between visits."
      ],
      "expect": [
        "A check of your gum health",
        "Scaling to remove tartar above and below the gum line",
        "Polishing to remove surface stains",
        "Practical advice for brushing and cleaning between teeth"
      ]
    }
  },
  {
    "slug": "fillings",
    "durationMinutes": 45,
    "priceCents": 35000,
    "en": {
      "name": "Fillings",
      "description": "Tooth-coloured fillings that restore strength and blend with your natural teeth.",
      "details": [
        "When decay or a small fracture has damaged a tooth, we remove the damaged part and rebuild it with a tooth-coloured composite.",
        "The tooth is fully numbed first. We keep as much healthy tooth as possible and shape the filling to fit your bite."
      ],
      "expect": [
        "Local anaesthetic so you feel no pain",
        "Gentle removal of decay",
        "A tooth-coloured filling matched to your shade",
        "A bite check and polish before you leave"
      ]
    }
  },
  {
    "slug": "root-canals",
    "durationMinutes": 90,
    "priceCents": 90000,
    "en": {
      "name": "Root canal treatment",
      "description": "Infection removed from inside the tooth under full numbing, so you keep your natural tooth.",
      "details": [
        "When the nerve inside a tooth is infected or inflamed, root canal treatment removes the infection and saves the tooth.",
        "It is done under full numbing at a calm, steady pace. Some teeth need a second visit; we tell you in advance if yours does."
      ],
      "expect": [
        "An X-ray to plan the treatment",
        "Full numbing before we begin",
        "Cleaning and sealing of the root canals",
        "A temporary or permanent filling, and aftercare advice"
      ]
    }
  },
  {
    "slug": "extractions",
    "durationMinutes": 45,
    "priceCents": 40000,
    "en": {
      "name": "Extractions",
      "description": "When a tooth cannot be saved, a planned and gentle removal with written aftercare.",
      "details": [
        "Sometimes a tooth cannot be saved. When that happens, we plan the removal carefully and make it as gentle as possible.",
        "We talk through the options for replacing the tooth, if you want one, before we begin."
      ],
      "expect": [
        "An examination and X-ray beforehand",
        "Full numbing before we begin",
        "A careful, unhurried removal",
        "Written aftercare and a follow-up check"
      ]
    }
  },
  {
    "slug": "whitening",
    "durationMinutes": 60,
    "priceCents": 120000,
    "en": {
      "name": "Teeth whitening",
      "description": "Gentle in-clinic whitening, planned around your sensitivity and the result you want.",
      "details": [
        "Professional whitening lightens the natural colour of your teeth safely, under supervision.",
        "We check your teeth and gums first, agree a realistic shade with you, and plan around any sensitivity."
      ],
      "expect": [
        "A check that whitening is right for you",
        "Your starting shade recorded",
        "Protection for your gums during treatment",
        "Advice on keeping the result"
      ]
    }
  },
  {
    "slug": "veneers",
    "durationMinutes": 60,
    "priceCents": 160000,
    "en": {
      "name": "Porcelain veneers",
      "description": "Thin porcelain shells that reshape chipped, worn or uneven front teeth. Price per tooth.",
      "details": [
        "Veneers are thin porcelain shells bonded to the front of teeth to change their shape, colour or length.",
        "We plan them with you, show you a preview before anything is made, and remove as little natural tooth as possible."
      ],
      "expect": [
        "A consultation about the result you want",
        "A preview of the planned shape and shade",
        "Preparation and impressions or a digital scan",
        "Fitting at a second visit"
      ]
    }
  },
  {
    "slug": "implants",
    "durationMinutes": 60,
    "priceCents": 25000,
    "en": {
      "name": "Implant consultation",
      "description": "An unhurried assessment of whether implants suit you, with costs and timings in writing.",
      "details": [
        "An implant replaces a missing tooth with a titanium post and a crown. This first visit is about whether it is the right choice for you.",
        "We examine the area, take the imaging we need, and give you the treatment plan, costs and timings in writing. There is no obligation to go ahead."
      ],
      "expect": [
        "An examination of the gap and the surrounding teeth",
        "Imaging to assess the bone",
        "An honest discussion of the alternatives",
        "A written plan with costs and timings"
      ]
    }
  },
  {
    "slug": "emergency",
    "durationMinutes": 30,
    "priceCents": 25000,
    "en": {
      "name": "Urgent appointment",
      "description": "Toothache, a broken tooth or swelling. We keep time free every day for urgent care.",
      "details": [
        "Toothache, a broken tooth, a lost filling or swelling: we keep time free every day we are open for urgent problems.",
        "The aim of this visit is to find the cause and get you out of pain. If you need further treatment, we plan it with you."
      ],
      "expect": [
        "A focused examination of the problem",
        "An X-ray if it is needed",
        "Treatment to relieve pain where possible",
        "A clear plan for any follow-up"
      ]
    }
  }
];

// ISO day of week (1 = Monday), clinic wall-clock time. null = closed.
const seedHours: { dayOfWeek: number; opens: string | null; closes: string | null }[] = [
  { dayOfWeek: 1, opens: "08:00", closes: "18:00" },
  { dayOfWeek: 2, opens: "08:00", closes: "18:00" },
  { dayOfWeek: 3, opens: "10:00", closes: "20:00" },
  { dayOfWeek: 4, opens: "08:00", closes: "18:00" },
  { dayOfWeek: 5, opens: "08:00", closes: "16:00" },
  { dayOfWeek: 6, opens: "09:00", closes: "13:00" },
  { dayOfWeek: 7, opens: null, closes: null },
];

async function main() {
  const rows = await db
    .insert(services)
    .values(seedServices.map((s, i) => ({ ...s, sortOrder: (i + 1) * 10 })))
    .onConflictDoUpdate({
      target: services.slug,
      set: {
        durationMinutes: sql`excluded.duration_minutes`,
        priceCents: sql`excluded.price_cents`,
        sortOrder: sql`excluded.sort_order`,
      },
    })
    .returning({ id: services.id, slug: services.slug });
  const idBySlug = new Map(rows.map((r) => [r.slug, r.id]));

  // The 7 working_hours rows already exist (migration 0001); they are only ever updated.
  const [translations, ...hours] = await db.batch([
    db
      .insert(serviceTranslations)
      .values(seedServices.map((s) => ({ serviceId: idBySlug.get(s.slug)!, locale: "en" as const, ...s.en })))
      .onConflictDoUpdate({
        target: [serviceTranslations.serviceId, serviceTranslations.locale],
        set: {
          name: sql`excluded.name`,
          description: sql`excluded.description`,
          details: sql`excluded.details`,
          expect: sql`excluded.expect`,
        },
      })
      .returning({ serviceId: serviceTranslations.serviceId }),
    ...seedHours.map(({ dayOfWeek, opens, closes }) =>
      db
        .update(workingHours)
        .set({ opens, closes })
        .where(eq(workingHours.dayOfWeek, dayOfWeek))
        .returning({ dayOfWeek: workingHours.dayOfWeek }),
    ),
  ]);

  const updatedDays = hours.flat().length;
  if (updatedDays !== 7) throw new Error(`Expected 7 working_hours rows, updated ${updatedDays}. Run db:migrate first.`);
  console.log(`Seeded ${rows.length} services, ${translations.length} translations, ${updatedDays} working days.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
