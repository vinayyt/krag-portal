import { setRequestLocale } from "next-intl/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { fetchDashboardData } from "@/lib/dashboard-data";
import { DashboardDataProvider } from "@/components/screens/dashboard/dashboard-context";
import { DashboardShell } from "@/components/screens/dashboard/dashboard-shell";

export default async function DashboardPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect(`/${locale}/auth`);

  const data = await fetchDashboardData(session.user.id);
  if (!data) redirect(`/${locale}/auth`);

  return (
    <DashboardDataProvider data={data}>
      <DashboardShell />
    </DashboardDataProvider>
  );
}
