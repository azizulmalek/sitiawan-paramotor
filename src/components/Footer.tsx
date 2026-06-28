import Link from "next/link";
import { Wind } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="mb-3 flex items-center gap-2 font-bold text-white">
            <Wind className="h-5 w-5 text-sky-400" />
            Sitiawan Paramotor Club
          </div>
          <p className="text-sm leading-relaxed">
            Certified tandem flights over Sitiawan. Fly with experienced operators and see Malaysia from a whole new perspective.
          </p>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-sky-400">About Us</Link></li>
            <li><Link href="/services" className="hover:text-sky-400">Experiences</Link></li>
            <li><Link href="/book" className="hover:text-sky-400">Book a Flight</Link></li>
            <li><Link href="/#contact" className="hover:text-sky-400">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-white">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>info@sitiawanparamotor.com</li>
            <li>+60 12-345 6789</li>
            <li>Sitiawan, Perak, Malaysia</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Sitiawan Paramotor Club. All rights reserved.
      </div>
    </footer>
  );
}
