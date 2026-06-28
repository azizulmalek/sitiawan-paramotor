"use client";

import { useEffect, useState } from "react";
import { format, addDays } from "date-fns";

type Operator = { id: string; name: string; active: boolean };
type Slot = {
  id: string;
  startTime: string;
  endTime: string;
  operators: { operatorId: string; operator: { name: string } }[];
  bookings: unknown[];
};

export default function AdminSlotsPage() {
  const [date, setDate] = useState(format(addDays(new Date(), 1), "yyyy-MM-dd"));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [assignments, setAssignments] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/operators").then((r) => r.json()).then((ops) => setOperators(ops.filter((o: Operator) => o.active)));
  }, []);

  useEffect(() => {
    if (!date) return;
    fetch(`/api/admin/slots?date=${date}`)
      .then((r) => r.json())
      .then((data: Slot[]) => {
        setSlots(data);
        const map: Record<string, string[]> = {};
        for (const slot of data) {
          map[slot.id] = slot.operators.map((o) => o.operatorId);
        }
        setAssignments(map);
      });
  }, [date]);

  function toggleOperator(slotId: string, operatorId: string) {
    setAssignments((prev) => {
      const current = prev[slotId] || [];
      const next = current.includes(operatorId)
        ? current.filter((id) => id !== operatorId)
        : [...current, operatorId];
      return { ...prev, [slotId]: next };
    });
  }

  async function saveSlot(slotId: string) {
    setSaving(true);
    await fetch("/api/admin/slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slotId, operatorIds: assignments[slotId] || [] }),
    });
    setSaving(false);
    setMessage("Slot updated!");
    setTimeout(() => setMessage(""), 2000);
    const res = await fetch(`/api/admin/slots?date=${date}`);
    setSlots(await res.json());
  }

  async function assignAllOperators() {
    const allIds = operators.map((o) => o.id);
    const newAssignments: Record<string, string[]> = {};
    for (const slot of slots) {
      newAssignments[slot.id] = allIds;
    }
    setAssignments(newAssignments);

    await fetch("/api/admin/slots", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date,
        assignments: slots.map((s) => ({ slotId: s.id, operatorIds: allIds })),
      }),
    });
    setMessage("All operators assigned to all slots!");
    const res = await fetch(`/api/admin/slots?date=${date}`);
    setSlots(await res.json());
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Slot Operator Assignments</h1>
          <p className="text-slate-600">Assign 3+ tandem operators per slot to enable multiple bookings</p>
        </div>
        <div className="flex items-center gap-3">
          <input type="date" className="input w-auto" value={date} onChange={(e) => setDate(e.target.value)} />
          <button onClick={assignAllOperators} className="btn-secondary" disabled={slots.length === 0}>
            Assign All Operators to All Slots
          </button>
        </div>
      </div>

      {message && <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</div>}

      {slots.length === 0 ? (
        <div className="card text-center text-slate-500">
          No slots for this date. Check availability rules or pick a day with scheduled hours.
        </div>
      ) : (
        <div className="space-y-4">
          {slots.map((slot) => {
            const assigned = assignments[slot.id] || [];
            const capacity = assigned.length;
            const booked = slot.bookings.length;

            return (
              <div key={slot.id} className="card">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-semibold">{slot.startTime} – {slot.endTime}</span>
                    <span className="ml-3 text-sm text-slate-500">
                      Capacity: {capacity} | Booked: {booked} | Available: {Math.max(0, capacity - booked)}
                    </span>
                  </div>
                  <button onClick={() => saveSlot(slot.id)} className="btn-primary text-xs" disabled={saving}>
                    Save
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {operators.map((op) => {
                    const selected = assigned.includes(op.id);
                    return (
                      <button
                        key={op.id}
                        onClick={() => toggleOperator(slot.id, op.id)}
                        className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                          selected
                            ? "border-sky-600 bg-sky-600 text-white"
                            : "border-slate-300 bg-white text-slate-700 hover:border-sky-400"
                        }`}
                      >
                        {op.name}
                      </button>
                    );
                  })}
                </div>
                {capacity < 3 && capacity > 0 && (
                  <p className="mt-2 text-xs text-amber-600">Tip: Assign 3+ operators for higher capacity.</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
