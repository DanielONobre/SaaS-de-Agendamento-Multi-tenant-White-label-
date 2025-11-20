import { BookingForm } from "@/components/booking-form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <BookingForm />
    </main>
  );
}