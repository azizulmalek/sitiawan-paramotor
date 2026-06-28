import { Suspense } from "react";
import BookingClient from "./BookingClient";

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-4xl px-4 py-20 text-center text-slate-500">
          Loading booking page...
        </div>
      }
    >
      <BookingClient />
    </Suspense>
  );
}
