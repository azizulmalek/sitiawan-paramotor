"use client";

import { useEffect, useState } from "react";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type Rule = { id: string; dayOfWeek: number; startTime: string; endTime: string; active: boolean };
type Override = { id: string; date: string; startTime?: string; endTime?: string; isClosed: boolean };

export default function AdminAvailabilityPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [overrides, setOverrides] = useState<Override[]>([]);
  const [newRule, setNewRule] = useState({ dayOfWeek: 6, startTime: "08:00", endTime: "16:00" });
  const [newOverride, setNewOverride] = useState({ date: "", startTime: "08:00", endTime: "16:00", isClosed: false });

  function load() {
    fetch("/api/availability")
      .then((r) => r.json())
      .then((data) => {
        setRules(data.rules);
        setOverrides(data.overrides.map((o: Override & { date: string }) => ({
          ...o,
          date: o.date.split("T")[0],
        })));
      });
  }

  useEffect(() => { load(); }, []);

  async function addRule() {
    await fetch("/api/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "rule", ...newRule }),
    });
    load();
  }

  async function addOverride() {
    if (!newOverride.date) return;
    await fetch("/api/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "override", ...newOverride }),
    });
    load();
  }

  async function toggleRule(id: string, active: boolean) {
    await fetch("/api/availability", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active }),
    });
    load();
  }

  async function deleteItem(id: string, type: string) {
    await fetch(`/api/availability?id=${id}&type=${type}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Availability Settings</h1>
      <p className="mb-8 text-slate-600">
        Set weekly schedules. Slots are generated in 30-minute blocks within these hours.
      </p>

      <div className="mb-8 card">
        <h2 className="mb-4 text-lg font-semibold">Weekly Schedule</h2>
        <div className="mb-4 flex flex-wrap items-end gap-3">
          <div>
            <label className="label">Day</label>
            <select
              className="input"
              value={newRule.dayOfWeek}
              onChange={(e) => setNewRule({ ...newRule, dayOfWeek: Number(e.target.value) })}
            >
              {DAY_NAMES.map((d, i) => (
                <option key={d} value={i}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Start</label>
            <input type="time" className="input" value={newRule.startTime} onChange={(e) => setNewRule({ ...newRule, startTime: e.target.value })} />
          </div>
          <div>
            <label className="label">End</label>
            <input type="time" className="input" value={newRule.endTime} onChange={(e) => setNewRule({ ...newRule, endTime: e.target.value })} />
          </div>
          <button onClick={addRule} className="btn-primary">Add Rule</button>
        </div>

        <div className="space-y-2">
          {rules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
              <div>
                <span className="font-medium">{DAY_NAMES[rule.dayOfWeek]}</span>
                <span className="ml-3 text-sm text-slate-500">{rule.startTime} – {rule.endTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleRule(rule.id, !rule.active)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${rule.active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}
                >
                  {rule.active ? "Active" : "Inactive"}
                </button>
                <button onClick={() => deleteItem(rule.id, "rule")} className="text-sm text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
          {rules.length === 0 && <p className="text-sm text-slate-500">No weekly rules configured.</p>}
        </div>
      </div>

      <div className="card">
        <h2 className="mb-4 text-lg font-semibold">Date Overrides</h2>
        <p className="mb-4 text-sm text-slate-500">Override hours for specific dates or mark dates as closed.</p>
        <div className="mb-4 flex flex-wrap items-end gap-3">
          <div>
            <label className="label">Date</label>
            <input type="date" className="input" value={newOverride.date} onChange={(e) => setNewOverride({ ...newOverride, date: e.target.value })} />
          </div>
          <div>
            <label className="label">Start</label>
            <input type="time" className="input" value={newOverride.startTime} disabled={newOverride.isClosed} onChange={(e) => setNewOverride({ ...newOverride, startTime: e.target.value })} />
          </div>
          <div>
            <label className="label">End</label>
            <input type="time" className="input" value={newOverride.endTime} disabled={newOverride.isClosed} onChange={(e) => setNewOverride({ ...newOverride, endTime: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={newOverride.isClosed} onChange={(e) => setNewOverride({ ...newOverride, isClosed: e.target.checked })} />
            Closed
          </label>
          <button onClick={addOverride} className="btn-primary">Add Override</button>
        </div>

        <div className="space-y-2">
          {overrides.map((o) => (
            <div key={o.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
              <div>
                <span className="font-medium">{o.date}</span>
                <span className="ml-3 text-sm text-slate-500">
                  {o.isClosed ? "Closed" : `${o.startTime} – ${o.endTime}`}
                </span>
              </div>
              <button onClick={() => deleteItem(o.id, "override")} className="text-sm text-red-600 hover:underline">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
