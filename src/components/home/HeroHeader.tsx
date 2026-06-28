"use client";

import Link from "next/link";
import SiteBrand from "@/components/SiteBrand";

type HeroHeaderProps = {
  siteName: string;
  logoUrl?: string;
};

export default function HeroHeader({ siteName, logoUrl }: HeroHeaderProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-10">
      <SiteBrand siteName={siteName} logoUrl={logoUrl} variant="light" />
      <nav className="flex items-center gap-6 md:gap-8">
        <Link
          href="/book"
          className="text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:text-amber-300 md:text-sm"
        >
          Book
        </Link>
        <Link
          href="#contact"
          className="text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:text-amber-300 md:text-sm"
        >
          Contact Us
        </Link>
      </nav>
    </header>
  );
}
