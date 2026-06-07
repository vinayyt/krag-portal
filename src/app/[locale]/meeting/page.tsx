import { setRequestLocale } from "next-intl/server";
import { MeetingBookingPage } from "@/components/screens/meeting/meeting-booking-page";

export default function Meeting({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <MeetingBookingPage />;
}
