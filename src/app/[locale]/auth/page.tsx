import { setRequestLocale } from "next-intl/server";
import { AuthPage } from "@/components/screens/auth/auth-page";

export default function Auth({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <AuthPage />;
}
