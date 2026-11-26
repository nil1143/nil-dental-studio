import { getDictionary } from "@/i18n/dictionaries";

export default async function Home() {
  const dict = await getDictionary();
  return (
    <main className="flex flex-1 items-center justify-center">
      <h1 className="text-2xl font-semibold">{dict.home.tagline}</h1>
    </main>
  );
}
