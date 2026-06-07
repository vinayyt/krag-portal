import { ProjectDetailPage } from "@/components/screens/project/project-detail-page";

export default function ProjectDetail({ params }: { params: { id: string } }) {
  return <ProjectDetailPage projectId={params.id} />;
}
