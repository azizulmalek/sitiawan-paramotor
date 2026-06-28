"use client";

import OptimizedImage from "@/components/OptimizedImage";
import { Reveal, Stagger, StaggerItem } from "./Reveal";

type SafetySectionProps = {
  title: string;
  text: string;
  imageUrl: string;
};

export default function SafetySection({ title, text, imageUrl }: SafetySectionProps) {
  return (
    <section className="relative -mt-px min-h-[80vh] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <Reveal variant="zoomIn" duration={1.2} className="h-full w-full">
          <div className="relative h-full w-full">
            <OptimizedImage
              src={imageUrl}
              alt="Paramotor safety equipment and briefing"
              fill
              sizes="100vw"
              quality={80}
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>

      <div className="absolute inset-0 bg-slate-900/75" />

      <div className="relative flex min-h-[80vh] items-center justify-center px-6 py-24 md:px-12">
        <Stagger className="max-w-3xl text-center text-white">
          <StaggerItem variant="fadeDown">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-amber-400">
              Our Commitment
            </p>
          </StaggerItem>
          <StaggerItem variant="zoomOut" duration={0.9}>
            <h2 className="mb-8 text-3xl font-light leading-snug tracking-wide md:text-5xl">
              {title}
            </h2>
          </StaggerItem>
          <StaggerItem variant="fadeUp" duration={0.8}>
            <p className="text-base leading-relaxed text-slate-200 md:text-lg">{text}</p>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}
