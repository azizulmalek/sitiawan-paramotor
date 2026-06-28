"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SiteBrand from "@/components/SiteBrand";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Experiences" },
  { href: "/book", label: "Book a Flight" },
];

type NavbarProps = {
  siteName: string;
  logoUrl?: string;
};

export default function Navbar({ siteName, logoUrl }: NavbarProps) {
  const pathname = usePathname();
  const isBookPage = pathname === "/book";
  const visibleLinks = isBookPage ? links.filter((link) => link.href === "/") : links;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <SiteBrand siteName={siteName} logoUrl={logoUrl} variant="dark" />
        <nav className="hidden items-center gap-6 md:flex">
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-sky-700"
            >
              {link.label}
            </Link>
          ))}
          {!isBookPage && (
            <Link href="/book" className="btn-primary">
              Book Now
            </Link>
          )}
        </nav>
        {!isBookPage ? (
          <div className="flex items-center gap-3 md:hidden">
            <Link href="/book" className="btn-primary px-3 py-2 text-xs">
              Book
            </Link>
          </div>
        ) : (
          <nav className="md:hidden">
            <Link href="/" className="text-sm font-medium text-slate-600 transition hover:text-sky-700">
              Home
            </Link>
          </nav>
        )}
      </div>
      {!isBookPage && (
        <nav className="flex gap-4 overflow-x-auto border-t border-slate-100 px-4 py-2 md:hidden">
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-xs font-medium text-slate-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
