import { setRequestLocale } from "next-intl/server";
import { RenoIntakePage } from "@/components/screens/renovation/intake/reno-intake-page";

export default function RenoveringPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <RenoIntakePage />;
}
