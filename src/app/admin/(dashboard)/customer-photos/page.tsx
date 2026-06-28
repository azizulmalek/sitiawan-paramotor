"use client";

import { useEffect, useState } from "react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import OptimizedImage from "@/components/OptimizedImage";

type CustomerPhoto = {
  id: string;
  imageUrl: string;
  caption: string | null;
  sortOrder: number;
  active: boolean;
};

const emptyForm = { imageUrl: "", caption: "", sortOrder: 0 };

export default function AdminCustomerPhotosPage() {
  const [photos, setPhotos] = useState<CustomerPhoto[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);

  function load() {
    fetch("/api/customer-photos").then((r) => r.json()).then(setPhotos);
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.imageUrl) return;

    if (editing) {
      await fetch("/api/customer-photos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing, ...form, caption: form.caption || null }),
      });
      setEditing(null);
    } else {
      await fetch("/api/customer-photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, caption: form.caption || null }),
      });
    }
    setForm(emptyForm);
    load();
  }

  async function toggleActive(id: string, active: boolean) {
    await fetch("/api/customer-photos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active }),
    });
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this photo?")) return;
    await fetch(`/api/customer-photos?id=${id}`, { method: "DELETE" });
    load();
  }

  function startEdit(photo: CustomerPhoto) {
    setEditing(photo.id);
    setForm({ imageUrl: photo.imageUrl, caption: photo.caption || "", sortOrder: photo.sortOrder });
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Customer Photo Gallery</h1>
      <p className="mb-8 text-slate-600">
        Manage happy customer photos shown in the auto-sliding gallery on the Guest Experiences section.
        Use portrait-oriented images for best results.
      </p>

      <div className="mb-8 card">
        <h2 className="mb-4 text-lg font-semibold">{editing ? "Edit Photo" : "Add Photo"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ImageUploadField
            label="Customer Photo *"
            value={form.imageUrl}
            onChange={(url) => setForm({ ...form, imageUrl: url })}
            hint="Portrait orientation recommended. Shown in the homepage slider."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Caption (optional)</label>
              <input
                className="input"
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
                placeholder="Sarah's first flight!"
              />
            </div>
            <div>
              <label className="label">Sort Order</label>
              <input
                type="number"
                className="input"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary" disabled={!form.imageUrl}>
              {editing ? "Update" : "Add Photo"}
            </button>
            {editing && (
              <button type="button" className="btn-secondary" onClick={() => { setEditing(null); setForm(emptyForm); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {photos.map((photo) => (
          <div key={photo.id} className="card overflow-hidden p-0">
            <div className="relative aspect-[3/4]">
              <OptimizedImage src={photo.imageUrl} alt={photo.caption || "Customer"} fill sizes="200px" className="object-cover" />
            </div>
            <div className="p-3">
              {photo.caption && <p className="mb-2 truncate text-sm text-slate-600">{photo.caption}</p>}
              <div className="flex flex-wrap gap-2">
                <button onClick={() => startEdit(photo)} className="text-xs text-sky-600 hover:underline">Edit</button>
                <button onClick={() => toggleActive(photo.id, !photo.active)} className="text-xs text-slate-600 hover:underline">
                  {photo.active ? "Hide" : "Show"}
                </button>
                <button onClick={() => handleDelete(photo.id)} className="text-xs text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {photos.length === 0 && <p className="text-sm text-slate-500">No customer photos yet.</p>}
      </div>
    </div>
  );
}
