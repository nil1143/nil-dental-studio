import type { Metadata } from "next";
import { AuthPage } from "@/components/auth/auth-page";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const { auth } = await getDictionary();
  return { title: auth.signUp.metaTitle };
}

export default function SignUpPage() {
  return <AuthPage mode="signUp" />;
}
