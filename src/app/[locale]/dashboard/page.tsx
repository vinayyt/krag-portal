import { setRequestLocale } from "next-intl/server";
import { DashboardShell } from "@/components/screens/dashboard/dashboard-shell";

export default function Dashboard({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <DashboardShell />;
}
