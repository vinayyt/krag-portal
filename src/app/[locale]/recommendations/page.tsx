import { setRequestLocale } from "next-intl/server";
import { RecommendationsPage } from "@/components/screens/recommendations/recommendations-page";

export default function Recommendations({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <RecommendationsPage />;
}
