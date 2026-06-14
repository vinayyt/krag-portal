import { setRequestLocale } from "next-intl/server";
import { RenoDashboardPage } from "@/components/screens/renovation/dashboard/reno-dashboard-page";

export default function RenoPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <RenoDashboardPage />;
}
