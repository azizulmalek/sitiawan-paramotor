"use client";

import { useRef, useState } from "react";
import OptimizedImage from "@/components/OptimizedImage";
import { Upload, Loader2, X } from "lucide-react";

type ImageUploadFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  previewFit?: "cover" | "contain";
};

const CHECKERBOARD_STYLE = {
  backgroundImage: `
    linear-gradient(45deg, #e2e8f0 25%, transparent 25%),
    linear-gradient(-45deg, #e2e8f0 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #e2e8f0 75%),
    linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)
  `,
  backgroundSize: "12px 12px",
  backgroundPosition: "0 0, 0 6px, 6px -6px, -6px 0px",
};

export default function ImageUploadField({
  label,
  value,
  onChange,
  hint,
  previewFit = "cover",
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove() {
    onChange("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  const previewClass =
    previewFit === "contain" ? "object-contain p-2" : "object-cover";

  return (
    <div>
      <label className="label">{label}</label>
      {hint && <p className="mb-2 text-xs text-slate-500">{hint}</p>}

      {value && (
        <div
          className={`relative mb-3 w-full max-w-md overflow-hidden rounded-lg border border-slate-200 ${
            previewFit === "contain" ? "h-28" : "h-40"
          }`}
          style={previewFit === "contain" ? CHECKERBOARD_STYLE : undefined}
        >
          <OptimizedImage src={value} alt="Preview" fill sizes="400px" className={previewClass} />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Uploading..." : value ? "Replace Image" : "Upload Image"}
        </button>
        {value && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
          >
            <X className="h-4 w-4" />
            Remove Image
          </button>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      </div>

      <div className="mt-2">
        <label className="label text-xs">Or paste image URL</label>
        <input
          className="input text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... or /uploads/..."
          disabled={uploading}
        />
      </div>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
