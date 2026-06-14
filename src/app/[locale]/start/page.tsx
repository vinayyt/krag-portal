import { setRequestLocale } from "next-intl/server";
import { StartPage } from "@/components/screens/start/start-page";

export default function StartRoute({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <StartPage />;
}
