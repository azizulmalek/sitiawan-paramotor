"use client";

import { useEffect, useState } from "react";
import { formatBookingItemsSummary, getOperatorsForItems } from "@/lib/packages";

type BookingItem = {
  packageId: string;
  quantity: number;
  unitPrice: number;
};

type Booking = {
  id: string;
  packageId: string;
  paxCount: number;
  totalPrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
  status: string;
  createdAt: string;
  items: BookingItem[];
  slot: { date: string; startTime: string; endTime: string; operators: { operator: { name: string } }[] };
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetch("/api/bookings").then((r) => r.json()).then(setBookings);
  }, []);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Bookings</h1>
      <p className="mb-8 text-slate-600">View all customer flight bookings</p>

      <div className="card overflow-x-auto">
        {bookings.length === 0 ? (
          <p className="text-sm text-slate-500">No bookings yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="pb-3 pr-4">Packages</th>
                <th className="pb-3 pr-4">Operators</th>
                <th className="pb-3 pr-4">Price</th>
                <th className="pb-3 pr-4">Customer</th>
                <th className="pb-3 pr-4">Contact</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Time Slot</th>
                <th className="pb-3 pr-4">Pilots</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const items = b.items?.length
                  ? b.items.map((i) => ({ packageId: i.packageId as "solo" | "adult-child" | "duo", quantity: i.quantity }))
                  : [{ packageId: b.packageId as "solo" | "adult-child" | "duo", quantity: 1 }];
                const operatorsUsed = b.items?.length
                  ? getOperatorsForItems(items)
                  : b.paxCount;

                return (
                  <tr key={b.id} className="border-b border-slate-100">
                    <td className="py-3 pr-4 text-xs">
                      {b.items?.length
                        ? formatBookingItemsSummary(items)
                        : b.packageId?.replace("-", " + ")}
                    </td>
                    <td className="py-3 pr-4">{operatorsUsed}</td>
                    <td className="py-3 pr-4">RM{b.totalPrice ?? "—"}</td>
                    <td className="py-3 pr-4">
                      <div className="font-medium">{b.customerName}</div>
                      {b.notes && <div className="text-xs text-slate-500">{b.notes}</div>}
                    </td>
                    <td className="py-3 pr-4">
                      <div>{b.customerEmail}</div>
                      <div className="text-xs text-slate-500">{b.customerPhone}</div>
                    </td>
                    <td className="py-3 pr-4">{new Date(b.slot.date).toLocaleDateString()}</td>
                    <td className="py-3 pr-4">{b.slot.startTime} – {b.slot.endTime}</td>
                    <td className="py-3 pr-4 text-xs">
                      {b.slot.operators.map((o) => o.operator.name).join(", ") || "—"}
                    </td>
                    <td className="py-3">
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
