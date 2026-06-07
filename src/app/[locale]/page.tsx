import { setRequestLocale } from "next-intl/server";
import { LandingPage } from "@/components/screens/landing/landing-page";

export default function Home({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <LandingPage />;
}
