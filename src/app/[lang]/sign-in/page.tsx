import type { Metadata } from "next";
import { AuthPage } from "@/components/auth/auth-page";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const { auth } = await getDictionary();
  return { title: auth.signIn.metaTitle };
}

export default function SignInPage() {
  return <AuthPage mode="signIn" />;
}
