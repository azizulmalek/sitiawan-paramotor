"use client";

import { Stagger, StaggerItem } from "./Reveal";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  eyebrowClass?: string;
  titleClass?: string;
  subtitleClass?: string;
  className?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  eyebrowClass = "text-sky-700",
  titleClass = "text-slate-900",
  subtitleClass = "text-slate-600",
  className = "",
}: SectionHeaderProps) {
  return (
    <Stagger className={`text-center ${className}`}>
      <StaggerItem variant="fadeDown">
        <p
          className={`mb-3 text-xs font-semibold uppercase tracking-[0.3em] ${eyebrowClass}`}
        >
          {eyebrow}
        </p>
      </StaggerItem>
      <StaggerItem variant="zoomOut" duration={0.85}>
        <h2
          className={`text-3xl font-light tracking-wide md:text-5xl ${titleClass}`}
        >
          {title}
        </h2>
      </StaggerItem>
      {subtitle && (
        <StaggerItem variant="fadeUp" duration={0.7}>
          <p className={`mx-auto mt-4 max-w-2xl ${subtitleClass}`}>{subtitle}</p>
        </StaggerItem>
      )}
    </Stagger>
  );
}
