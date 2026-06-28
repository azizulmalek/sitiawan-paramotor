"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { format, addDays } from "date-fns";
import { Calendar, Clock, CheckCircle, Package, Plus, Trash2 } from "lucide-react";
import {
  FLIGHT_PACKAGES,
  type PackageId,
  type BookingItemInput,
  calculateItemsTotal,
  formatBookingItemsSummary,
  getOperatorsForItems,
  getOperatorsPerPackage,
  getPackageById,
  isValidPackageId,
} from "@/lib/packages";

type Slot = {
  id: string;
  startTime: string;
  endTime: string;
  capacity: number;
  booked: number;
  available: number;
  operators: string[];
  bookable: boolean;
};

type CartLine = {
  id: string;
  packageId: PackageId;
  quantity: number;
};

let lineIdCounter = 0;

function newLine(packageId: PackageId = "solo"): CartLine {
  lineIdCounter += 1;
  return { id: `line-${lineIdCounter}`, packageId, quantity: 1 };
}

async function fetchJson(url: string, label: string) {
  const res = await fetch(url);
  const contentType = res.headers.get("content-type") ?? "";
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${label} failed (${res.status})`);
  }
  if (!contentType.includes("application/json")) {
    throw new Error(`${label} returned non-JSON response`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${label} returned invalid JSON`);
  }
}

export default function BookingClient() {
  const searchParams = useSearchParams();
  const initialPackage = searchParams.get("package");
  const defaultPackageId: PackageId =
    initialPackage && isValidPackageId(initialPackage) ? initialPackage : "solo";

  const [cart, setCart] = useState<CartLine[]>([newLine(defaultPackageId)]);
  const [date, setDate] = useState(format(addDays(new Date(), 1), "yyyy-MM-dd"));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    notes: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [intro, setIntro] = useState("");

  const items: BookingItemInput[] = useMemo(
    () => cart.map(({ packageId, quantity }) => ({ packageId, quantity })),
    [cart]
  );

  const operatorsRequired = getOperatorsForItems(items);
  const totalPrice = calculateItemsTotal(items);
  const itemsSummary = formatBookingItemsSummary(items);

  useEffect(() => {
    fetchJson("/api/cms", "cms")
      .then((c) => {
        const item = c.booking_intro;
        setIntro(typeof item === "string" ? item : item?.content ?? "");
      })
      .catch((err: Error) => setLoadError(err.message));
  }, []);

  useEffect(() => {
    setSelectedSlot(null);
  }, [cart]);

  useEffect(() => {
    if (!date) return;
    setLoading(true);
    setSelectedSlot(null);
    setLoadError("");
    fetchJson(`/api/slots?date=${date}&operators=${operatorsRequired}`, "slots")
      .then((data) => setSlots(data.slots || []))
      .catch((err: Error) => {
        setSlots([]);
        setLoadError(err.message);
      })
      .finally(() => setLoading(false));
  }, [date, operatorsRequired]);

  const bookableSlotCount = useMemo(
    () => slots.filter((s) => s.bookable).length,
    [slots]
  );

  function updateLine(id: string, patch: Partial<Pick<CartLine, "packageId" | "quantity">>) {
    setCart((lines) => lines.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }

  function addLine() {
    setCart((lines) => [...lines, newLine("solo")]);
  }

  function removeLine(id: string) {
    setCart((lines) => (lines.length <= 1 ? lines : lines.filter((l) => l.id !== id)));
  }

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlot) return;
    setError("");

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slotId: selectedSlot.id,
        items,
        ...form,
      }),
    });

    if (res.ok) {
      setSuccess(true);
      setForm({ customerName: "", customerEmail: "", customerPhone: "", notes: "" });
      setSelectedSlot(null);
      setCart([newLine(defaultPackageId)]);
      const data = await fetchJson(
        `/api/slots?date=${date}&operators=${operatorsRequired}`,
        "slots-refresh"
      );
      setSlots(data.slots || []);
    } else {
      let message = "Booking failed";
      try {
        const data = await res.json();
        message = data.error || message;
      } catch {
        /* non-JSON error body */
      }
      setError(message);
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
        <h1 className="mb-2 text-2xl font-bold text-slate-900">Booking Confirmed!</h1>
        <p className="mb-6 text-slate-600">
          We&apos;ll send confirmation details to your email. See you in the skies!
        </p>
        <button onClick={() => setSuccess(false)} className="btn-primary">
          Book Another Flight
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="mb-3 text-3xl font-bold text-slate-900">Book Your Tandem Flight</h1>
        <p className="text-slate-600">{intro}</p>
      </div>

      {loadError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}. Try refreshing the page. If this persists, restart the dev server with{" "}
          <code className="rounded bg-red-100 px-1">npm run dev</code>.
        </div>
      )}

      <div className="mb-8 card">
        <label className="label mb-2 flex items-center gap-2">
          <Package className="h-4 w-4" />
          Choose Packages
        </label>
        <p className="mb-4 text-sm text-slate-500">
          Select how many of each package you need. Children (5–12) ride with an adult on the
          same flight and do not use an extra operator. Example: 3× Solo for three friends, or
          1× Duo + 1× Solo for parents plus a teen with a younger sibling flying free.
        </p>

        <div className="space-y-3">
          {cart.map((line) => {
            const pkg = getPackageById(line.packageId);
            return (
              <div
                key={line.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-stone-50 p-4 sm:flex-row sm:items-end"
              >
                <div className="flex-1">
                  <label className="label text-xs">Package</label>
                  <select
                    className="input"
                    value={line.packageId}
                    onChange={(e) =>
                      updateLine(line.id, { packageId: e.target.value as PackageId })
                    }
                  >
                    {FLIGHT_PACKAGES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} — RM{p.price} ({p.operatorsPerUnit} operator
                        {p.operatorsPerUnit !== 1 ? "s" : ""}/unit)
                      </option>
                    ))}
                  </select>
                  {pkg && (
                    <p className="mt-1 text-xs text-slate-500">{pkg.note}</p>
                  )}
                </div>
                <div className="w-full sm:w-28">
                  <label className="label text-xs">Quantity</label>
                  <input
                    type="number"
                    className="input"
                    min={1}
                    max={20}
                    value={line.quantity}
                    onChange={(e) =>
                      updateLine(line.id, {
                        quantity: Math.max(1, parseInt(e.target.value, 10) || 1),
                      })
                    }
                  />
                </div>
                <div className="text-sm text-slate-600 sm:pb-2">
                  {line.quantity * getOperatorsPerPackage(line.packageId)} operator spot
                  {line.quantity * getOperatorsPerPackage(line.packageId) !== 1 ? "s" : ""}
                </div>
                <button
                  type="button"
                  onClick={() => removeLine(line.id)}
                  disabled={cart.length <= 1}
                  className="self-end rounded-lg p-2 text-slate-400 transition hover:bg-slate-200 hover:text-red-600 disabled:opacity-30 sm:mb-1"
                  aria-label="Remove package"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={addLine}
          className="mt-4 flex items-center gap-2 text-sm font-medium text-sky-700 hover:text-sky-800"
        >
          <Plus className="h-4 w-4" />
          Add another package
        </button>

        <div className="mt-6 rounded-lg bg-sky-50 px-4 py-3 text-sm text-sky-900">
          <strong>{itemsSummary}</strong> · {operatorsRequired} operator spot
          {operatorsRequired !== 1 ? "s" : ""} total · <strong>RM{totalPrice}</strong>
        </div>
      </div>

      <div className="mb-8 card">
        <label className="label flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Select Date
        </label>
        <input
          type="date"
          className="input max-w-xs"
          value={date}
          min={format(new Date(), "yyyy-MM-dd")}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center text-slate-500">Loading available slots...</div>
      ) : slots.length === 0 ? (
        <div className="card text-center text-slate-500">
          No available slots for this date. Try a Saturday or Sunday, or contact us for
          special arrangements.
        </div>
      ) : (
        <>
          <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold">
            <Clock className="h-5 w-5 text-sky-600" />
            Available 30-Minute Slots
          </h2>
          <p className="mb-4 text-sm text-slate-500">
            Showing slots with at least {operatorsRequired} operator spot
            {operatorsRequired !== 1 ? "s" : ""} available ({bookableSlotCount} of {slots.length}{" "}
            slots)
          </p>
          <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {slots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => slot.bookable && setSelectedSlot(slot)}
                disabled={!slot.bookable}
                className={`rounded-xl border p-4 text-left transition ${
                  selectedSlot?.id === slot.id
                    ? "border-sky-600 bg-sky-50 ring-2 ring-sky-600"
                    : slot.bookable
                      ? "border-slate-200 bg-white hover:border-sky-400 hover:shadow-sm"
                      : "cursor-not-allowed border-slate-100 bg-slate-50 opacity-60"
                }`}
              >
                <div className="font-semibold text-slate-900">
                  {slot.startTime} – {slot.endTime}
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  {slot.capacity === 0
                    ? "No operators assigned"
                    : slot.available >= operatorsRequired
                      ? `${slot.available} of ${slot.capacity} operator spots available`
                      : `Only ${slot.available} spot${slot.available !== 1 ? "s" : ""} left (need ${operatorsRequired})`}
                </div>
                {slot.operators.length > 0 && (
                  <div className="mt-2 text-xs text-slate-400">
                    Operators: {slot.operators.join(", ")}
                  </div>
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {selectedSlot && (
        <div className="card">
          <h2 className="mb-2 text-lg font-semibold">
            Complete Booking — {selectedSlot.startTime} to {selectedSlot.endTime}
          </h2>
          <p className="mb-4 text-sm text-slate-600">
            {itemsSummary} · {operatorsRequired} operator spot
            {operatorsRequired !== 1 ? "s" : ""} · RM{totalPrice}
          </p>
          <form onSubmit={handleBook} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Full Name *</label>
              <input
                className="input"
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Email *</label>
              <input
                type="email"
                className="input"
                value={form.customerEmail}
                onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Phone *</label>
              <input
                type="tel"
                className="input"
                value={form.customerPhone}
                onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Notes (optional)</label>
              <textarea
                className="input"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Passenger names, ages, package details..."
              />
            </div>
            {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
            <div className="sm:col-span-2">
              <button type="submit" className="btn-primary w-full sm:w-auto">
                Confirm Booking — RM{totalPrice}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
