import { asc } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { workingHours } from "@/db/schema/clinic";

// "08:00:00" → "08:00". Clinic wall-clock time (Europe/Warsaw); no instant conversion here.
const toHourMinute = (value: string | null) => value?.slice(0, 5) ?? null;

// The weekly opening hours, Monday (1) to Sunday (7). opens/closes are null on closed days.
export async function getWorkingHours() {
  "use cache";
  cacheLife("minutes");
  cacheTag("working-hours");
  const rows = await db.select().from(workingHours).orderBy(asc(workingHours.dayOfWeek));
  return rows.map(({ dayOfWeek, opens, closes }) => ({
    dayOfWeek,
    opens: toHourMinute(opens),
    closes: toHourMinute(closes),
  }));
}
