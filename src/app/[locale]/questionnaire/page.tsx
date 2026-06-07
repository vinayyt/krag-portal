import { setRequestLocale } from "next-intl/server";
import { QuestionnairePage } from "@/components/screens/questionnaire/questionnaire-page";

export default function Questionnaire({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <QuestionnairePage />;
}
