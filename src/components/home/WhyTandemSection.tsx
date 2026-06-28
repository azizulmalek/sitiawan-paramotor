"use client";

import OptimizedImage from "@/components/OptimizedImage";
import { Reveal, Stagger, StaggerItem } from "./Reveal";

type WhyTandemSectionProps = {
  title: string;
  text: string;
  imageUrl: string;
};

export default function WhyTandemSection({
  title,
  text,
  imageUrl,
}: WhyTandemSectionProps) {
  return (
    <section className="bg-white text-slate-900">
      <div className="mx-auto grid max-w-7xl items-stretch lg:grid-cols-2">
        <div className="relative min-h-[50vh] overflow-hidden lg:h-[70vh] lg:min-h-0">
          <Reveal variant="zoomIn" duration={1} className="absolute inset-0">
            <OptimizedImage
              src={imageUrl}
              alt="Paramotor tandem flight experience"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={80}
              className="object-cover"
            />
          </Reveal>
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-black/75 via-black/30 to-transparent md:h-32"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent md:h-40"
            aria-hidden
          />
        </div>

        <div className="flex flex-col justify-center px-8 py-10 md:px-16 md:py-14 lg:py-16">
          <Stagger>
            <StaggerItem variant="fadeRight">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">
                Discover
              </p>
            </StaggerItem>
            <StaggerItem variant="fadeRight" duration={0.85}>
              <h2 className="mb-4 text-3xl font-light leading-snug tracking-wide md:text-4xl lg:text-5xl">
                {title}
              </h2>
            </StaggerItem>
            <StaggerItem variant="fadeRight" duration={0.8}>
              <p className="text-base leading-relaxed text-slate-600 md:text-lg">{text}</p>
            </StaggerItem>
          </Stagger>
        </div>
      </div>
    </section>
  );
}
