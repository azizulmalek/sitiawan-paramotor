"use client";

import OptimizedImage from "@/components/OptimizedImage";
import { Award, Briefcase } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { Reveal } from "./Reveal";

type Operator = {
  id: string;
  name: string;
  bio: string | null;
  photoUrl: string | null;
  experience: string | null;
  background: string | null;
  certifications: string | null;
};

type OperatorsSectionProps = {
  title: string;
  subtitle: string;
  operators: Operator[];
};

const FALLBACK_PHOTO =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80";

export default function OperatorsSection({
  title,
  subtitle,
  operators,
}: OperatorsSectionProps) {
  return (
    <section className="bg-stone-50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeader
          className="mb-16"
          eyebrow="Meet the Team"
          title={title}
          subtitle={subtitle}
        />

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {operators.map((op, i) => (
            <Reveal
              key={op.id}
              as="article"
              variant="fadeUp"
              delay={i * 0.1}
              duration={0.7}
              className="group overflow-hidden bg-white shadow-sm transition hover:shadow-lg"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <OptimizedImage
                  src={op.photoUrl || FALLBACK_PHOTO}
                  alt={op.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  quality={80}
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900">{op.name}</h3>
                {op.experience && (
                  <p className="mt-2 flex items-start gap-2 text-sm text-sky-700">
                    <Award className="mt-0.5 h-4 w-4 shrink-0" />
                    {op.experience}
                  </p>
                )}
                {op.background && (
                  <p className="mt-2 flex items-start gap-2 text-sm text-slate-600">
                    <Briefcase className="mt-0.5 h-4 w-4 shrink-0" />
                    {op.background}
                  </p>
                )}
                {op.certifications && (
                  <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                    {op.certifications}
                  </p>
                )}
                {op.bio && (
                  <p className="mt-4 text-sm leading-relaxed text-slate-500">{op.bio}</p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
