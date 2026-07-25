import { setRequestLocale } from "next-intl/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/screens/admin/admin-dashboard";

export default async function AdminPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "BUILDER") {
    redirect(`/${locale}/auth`);
  }

  return <AdminDashboard locale={locale} builderName={session.user.name} />;
}
