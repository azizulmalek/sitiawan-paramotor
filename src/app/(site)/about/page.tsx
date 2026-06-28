import { getCmsContent, CMS_KEYS } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const cms = await getCmsContent();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-6 text-4xl font-bold text-slate-900">
        {cms[CMS_KEYS.aboutTitle] || "About Our Paramotor Club"}
      </h1>
      <div className="prose prose-slate max-w-none">
        <p className="text-lg leading-relaxed text-slate-600 whitespace-pre-line">
          {cms[CMS_KEYS.aboutContent]}
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {[
          { stat: "500+", label: "Flights Completed" },
          { stat: "4", label: "Certified Operators" },
          { stat: "100%", label: "Safety Record" },
        ].map((item) => (
          <div key={item.label} className="card text-center">
            <div className="text-3xl font-bold text-sky-600">{item.stat}</div>
            <div className="mt-1 text-sm text-slate-600">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
