"use client";

import { useEffect, useState } from "react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import OptimizedImage from "@/components/OptimizedImage";

type Operator = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  bio?: string;
  photoUrl?: string;
  experience?: string;
  background?: string;
  certifications?: string;
  sortOrder: number;
  showOnHomepage: boolean;
  active: boolean;
};

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  bio: "",
  photoUrl: "",
  experience: "",
  background: "",
  certifications: "",
  sortOrder: 0,
  showOnHomepage: true,
};

export default function AdminOperatorsPage() {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);

  function load() {
    fetch("/api/operators").then((r) => r.json()).then(setOperators);
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      await fetch("/api/operators", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing, ...form }),
      });
      setEditing(null);
    } else {
      await fetch("/api/operators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm(emptyForm);
    load();
  }

  async function toggleActive(id: string, active: boolean) {
    await fetch("/api/operators", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active }),
    });
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this operator?")) return;
    await fetch(`/api/operators?id=${id}`, { method: "DELETE" });
    load();
  }

  function startEdit(op: Operator) {
    setEditing(op.id);
    setForm({
      name: op.name,
      email: op.email || "",
      phone: op.phone || "",
      bio: op.bio || "",
      photoUrl: op.photoUrl || "",
      experience: op.experience || "",
      background: op.background || "",
      certifications: op.certifications || "",
      sortOrder: op.sortOrder,
      showOnHomepage: op.showOnHomepage,
    });
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Tandem Operators</h1>
      <p className="mb-8 text-slate-600">
        Manage operators shown on the homepage and assign them to booking slots.
      </p>

      <div className="mb-8 card">
        <h2 className="mb-4 text-lg font-semibold">{editing ? "Edit Operator" : "Add Operator"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Name *</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="label">Experience</label>
              <input className="input" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="500+ tandem flights, 8 years" />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Background</label>
            <input className="input" value={form.background} onChange={(e) => setForm({ ...form, background: e.target.value })} placeholder="Former military pilot, aviation instructor..." />
          </div>
          <div>
            <label className="label">Certifications</label>
            <input className="input" value={form.certifications} onChange={(e) => setForm({ ...form, certifications: e.target.value })} placeholder="APPI Tandem, First Aid Certified" />
          </div>
          <div>
            <label className="label">Bio</label>
            <textarea className="input" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="A short personal bio for the homepage..." />
          </div>
          <ImageUploadField
            label="Portrait Photo"
            value={form.photoUrl}
            onChange={(url) => setForm({ ...form, photoUrl: url })}
            hint="Portrait orientation recommended (3:4 ratio)."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Sort Order</label>
              <input type="number" className="input" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
            </div>
            <label className="flex items-center gap-2 pt-6 text-sm">
              <input type="checkbox" checked={form.showOnHomepage} onChange={(e) => setForm({ ...form, showOnHomepage: e.target.checked })} />
              Show on homepage
            </label>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary">{editing ? "Update" : "Add Operator"}</button>
            {editing && (
              <button type="button" className="btn-secondary" onClick={() => { setEditing(null); setForm(emptyForm); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {operators.map((op) => (
          <div key={op.id} className="card overflow-hidden p-0">
            {op.photoUrl && (
              <div className="relative h-48 w-full">
                <OptimizedImage src={op.photoUrl} alt={op.name} fill sizes="300px" className="object-cover" />
              </div>
            )}
            <div className="p-4">
              <div className="mb-2 flex items-start justify-between">
                <h3 className="font-semibold text-slate-900">{op.name}</h3>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${op.active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                  {op.active ? "Active" : "Inactive"}
                </span>
              </div>
              {op.experience && <p className="text-sm text-sky-700">{op.experience}</p>}
              {op.bio && <p className="mt-2 text-sm text-slate-600">{op.bio}</p>}
              <div className="mt-4 flex gap-2">
                <button onClick={() => startEdit(op)} className="text-sm text-sky-600 hover:underline">Edit</button>
                <button onClick={() => toggleActive(op.id, !op.active)} className="text-sm text-slate-600 hover:underline">
                  {op.active ? "Deactivate" : "Activate"}
                </button>
                <button onClick={() => handleDelete(op.id)} className="text-sm text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
