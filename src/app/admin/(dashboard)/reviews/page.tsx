"use client";

import { useEffect, useState } from "react";
import ImageUploadField from "@/components/admin/ImageUploadField";

type Review = {
  id: string;
  author: string;
  text: string;
  rating: number;
  location: string | null;
  imageUrl: string | null;
  sortOrder: number;
  active: boolean;
};

const emptyForm = {
  author: "",
  text: "",
  rating: 5,
  location: "",
  imageUrl: "",
  sortOrder: 0,
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);

  function load() {
    fetch("/api/reviews").then((r) => r.json()).then(setReviews);
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      location: form.location || null,
      imageUrl: form.imageUrl || null,
    };

    if (editing) {
      await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing, ...payload }),
      });
      setEditing(null);
    } else {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setForm(emptyForm);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
    load();
  }

  async function toggleActive(id: string, active: boolean) {
    await fetch("/api/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active }),
    });
    load();
  }

  function startEdit(review: Review) {
    setEditing(review.id);
    setForm({
      author: review.author,
      text: review.text,
      rating: review.rating,
      location: review.location || "",
      imageUrl: review.imageUrl || "",
      sortOrder: review.sortOrder,
    });
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Reviews</h1>
      <p className="mb-8 text-slate-600">Manage guest reviews shown on the homepage</p>

      <div className="mb-8 card">
        <h2 className="mb-4 text-lg font-semibold">{editing ? "Edit Review" : "Add Review"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Guest Name *</label>
              <input className="input" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
            </div>
            <div>
              <label className="label">Location</label>
              <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Kuala Lumpur, Malaysia" />
            </div>
          </div>
          <div>
            <label className="label">Review Text *</label>
            <textarea className="input min-h-[100px]" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Rating (1-5)</label>
              <input type="number" min={1} max={5} className="input" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
            </div>
            <div>
              <label className="label">Sort Order</label>
              <input type="number" className="input" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
            </div>
          </div>
          <ImageUploadField
            label="Guest Photo (optional)"
            value={form.imageUrl}
            onChange={(url) => setForm({ ...form, imageUrl: url })}
          />
          <div className="flex gap-2">
            <button type="submit" className="btn-primary">{editing ? "Update" : "Add Review"}</button>
            {editing && (
              <button type="button" className="btn-secondary" onClick={() => { setEditing(null); setForm(emptyForm); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="card flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold">{review.author}</h3>
                <span className="text-amber-500">{"★".repeat(review.rating)}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs ${review.active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                  {review.active ? "Active" : "Hidden"}
                </span>
              </div>
              {review.location && <p className="text-sm text-slate-500">{review.location}</p>}
              <p className="mt-2 text-sm text-slate-600">&ldquo;{review.text}&rdquo;</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button onClick={() => startEdit(review)} className="text-sm text-sky-600 hover:underline">Edit</button>
              <button onClick={() => toggleActive(review.id, !review.active)} className="text-sm text-slate-600 hover:underline">
                {review.active ? "Hide" : "Show"}
              </button>
              <button onClick={() => handleDelete(review.id)} className="text-sm text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-sm text-slate-500">No reviews yet.</p>}
      </div>
    </div>
  );
}
