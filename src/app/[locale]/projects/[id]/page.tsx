import { setRequestLocale } from "next-intl/server";
import { ProjectDetailPage } from "@/components/screens/project/project-detail-page";

export default function ProjectDetail({
  params,
}: {
  params: { locale: string; id: string };
}) {
  setRequestLocale(params.locale);
  return <ProjectDetailPage projectId={params.id} />;
}
