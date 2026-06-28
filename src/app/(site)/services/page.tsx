import Link from "next/link";
import { getCmsContent, CMS_KEYS } from "@/lib/cms";
import { Plane, Sunset, Users } from "lucide-react";

export default async function ServicesPage() {
  const cms = await getCmsContent();

  const services = [
    {
      icon: Plane,
      title: cms[CMS_KEYS.service1Title] || "Tandem Discovery Flight",
      content: cms[CMS_KEYS.service1Content],
    },
    {
      icon: Sunset,
      title: cms[CMS_KEYS.service2Title] || "Sunset Flight",
      content: cms[CMS_KEYS.service2Content],
    },
    {
      icon: Users,
      title: cms[CMS_KEYS.service3Title] || "Group Adventure",
      content: cms[CMS_KEYS.service3Content],
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-slate-900">
          {cms[CMS_KEYS.servicesTitle] || "Our Experiences"}
        </h1>
        <p className="mt-3 text-slate-600">Choose your adventure and book a 30-minute time slot</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div key={service.title} className="card flex flex-col">
              <Icon className="mb-4 h-10 w-10 text-sky-600" />
              <h2 className="mb-3 text-xl font-semibold text-slate-900">{service.title}</h2>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-slate-600">{service.content}</p>
              <Link href="/book" className="btn-primary text-center">Book This Experience</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
