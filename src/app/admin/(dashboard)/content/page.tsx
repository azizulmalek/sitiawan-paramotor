"use client";

import { useEffect, useState } from "react";
import { CMS_KEYS } from "@/lib/cms";
import ImageUploadField from "@/components/admin/ImageUploadField";

type CmsField = {
  key: string;
  label: string;
  type: "text" | "textarea" | "image";
  section: string;
  imageHint?: string;
  previewFit?: "cover" | "contain";
};

const CMS_FIELDS: CmsField[] = [
  { key: CMS_KEYS.siteName, label: "Club Name", type: "text", section: "Branding" },
  { key: CMS_KEYS.siteTagline, label: "Tagline", type: "text", section: "Branding" },
  { key: CMS_KEYS.siteLogo, label: "Header Logo", type: "image", section: "Branding", previewFit: "contain", imageHint: "Shown in the site header. PNG with transparent background recommended. Leave empty to use the default icon." },

  { key: CMS_KEYS.heroImage, label: "Hero Background Image", type: "image", section: "Hero (Full Screen)" },
  { key: CMS_KEYS.heroTitle, label: "Hero Title", type: "text", section: "Hero (Full Screen)" },
  { key: CMS_KEYS.heroSubtitle, label: "Hero Subtitle", type: "textarea", section: "Hero (Full Screen)" },

  { key: CMS_KEYS.whyTandemImage, label: "Section Image", type: "image", section: "Why Try Paramotor Tandem" },
  { key: CMS_KEYS.whyTandemTitle, label: "Title", type: "text", section: "Why Try Paramotor Tandem" },
  { key: CMS_KEYS.whyTandemText, label: "Text", type: "textarea", section: "Why Try Paramotor Tandem" },

  { key: CMS_KEYS.safetyImage, label: "Background Image", type: "image", section: "Safety Section" },
  { key: CMS_KEYS.safetyTitle, label: "Title", type: "text", section: "Safety Section" },
  { key: CMS_KEYS.safetyText, label: "Text", type: "textarea", section: "Safety Section" },

  { key: CMS_KEYS.operatorsTitle, label: "Section Title", type: "text", section: "Operators Section" },
  { key: CMS_KEYS.operatorsSubtitle, label: "Section Subtitle", type: "textarea", section: "Operators Section" },

  { key: CMS_KEYS.reviewsTitle, label: "Section Title", type: "text", section: "Reviews Section" },
  { key: CMS_KEYS.reviewsSubtitle, label: "Section Subtitle", type: "textarea", section: "Reviews Section" },

  { key: CMS_KEYS.contactTitle, label: "Title", type: "text", section: "Contact Section" },
  { key: CMS_KEYS.contactText, label: "Description", type: "textarea", section: "Contact Section" },
  { key: CMS_KEYS.contactEmail, label: "Email", type: "text", section: "Contact Section" },
  { key: CMS_KEYS.contactPhone, label: "Phone", type: "text", section: "Contact Section" },
  { key: CMS_KEYS.contactWhatsapp, label: "WhatsApp", type: "text", section: "Contact Section" },
  { key: CMS_KEYS.contactAddress, label: "Address", type: "text", section: "Contact Section" },

  { key: CMS_KEYS.bookingIntro, label: "Booking Page Intro", type: "textarea", section: "Other Pages" },
  { key: CMS_KEYS.aboutTitle, label: "About Page Title", type: "text", section: "Other Pages" },
  { key: CMS_KEYS.aboutContent, label: "About Page Content", type: "textarea", section: "Other Pages" },
  { key: CMS_KEYS.servicesTitle, label: "Services Page Title", type: "text", section: "Other Pages" },
];

type CmsData = Record<string, { content: string; title: string | null; imageUrl: string | null }>;

export default function AdminContentPage() {
  const [data, setData] = useState<CmsData>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/cms").then((r) => r.json()).then(setData);
  }, []);

  const sections = Array.from(new Set(CMS_FIELDS.map((f) => f.section)));

  function getContent(key: string) {
    return data[key]?.content ?? "";
  }

  function getImage(key: string) {
    return data[key]?.imageUrl ?? data[key]?.content ?? "";
  }

  function setContent(key: string, content: string) {
    setData((prev) => ({
      ...prev,
      [key]: { ...prev[key], content, title: prev[key]?.title ?? null, imageUrl: prev[key]?.imageUrl ?? null },
    }));
  }

  function setImage(key: string, imageUrl: string) {
    setData((prev) => ({
      ...prev,
      [key]: {
        content: prev[key]?.content ?? imageUrl,
        title: prev[key]?.title ?? null,
        imageUrl,
      },
    }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");

    const items = CMS_FIELDS.map((f) => {
      const item = data[f.key];
      if (f.type === "image") {
        const imageUrl = item?.imageUrl || item?.content || "";
        return { key: f.key, content: imageUrl, imageUrl: imageUrl || null };
      }
      return { key: f.key, content: item?.content ?? "", imageUrl: item?.imageUrl ?? null };
    });

    const res = await fetch("/api/cms", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });

    setSaving(false);
    setMessage(res.ok ? "Content saved successfully!" : "Failed to save content.");
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Homepage CMS</h1>
          <p className="text-slate-600">Edit images, titles, and text for each section</p>
        </div>
        <button onClick={handleSave} className="btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      {message && (
        <div className={`mb-6 rounded-lg p-3 text-sm ${message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message}
        </div>
      )}

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section} className="card">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">{section}</h2>
            <div className="space-y-5">
              {CMS_FIELDS.filter((f) => f.section === section).map((field) => (
                <div key={field.key}>
                  {field.type === "image" ? (
                    <ImageUploadField
                      label={field.label}
                      value={getImage(field.key)}
                      onChange={(url) => setImage(field.key, url)}
                      hint={
                        field.imageHint ??
                        "Recommended: 1920px wide, JPEG or WebP. Use Remove Image to clear."
                      }
                      previewFit={field.previewFit}
                    />
                  ) : field.type === "textarea" ? (
                    <>
                      <label className="label">{field.label}</label>
                      <textarea
                        className="input min-h-[120px]"
                        value={getContent(field.key)}
                        onChange={(e) => setContent(field.key, e.target.value)}
                      />
                    </>
                  ) : (
                    <>
                      <label className="label">{field.label}</label>
                      <input
                        className="input"
                        value={getContent(field.key)}
                        onChange={(e) => setContent(field.key, e.target.value)}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
