"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "./Reveal";

type ContactSectionProps = {
  title: string;
  text: string;
  email: string;
  phone: string;
  address: string;
  whatsapp?: string;
};

export default function ContactSection({
  title,
  text,
  email,
  phone,
  address,
  whatsapp,
}: ContactSectionProps) {
  const contactItems = [
    email && {
      key: "email",
      href: `mailto:${email}`,
      icon: Mail,
      label: "Email",
      value: email,
      iconClass: "text-amber-400",
    },
    phone && {
      key: "phone",
      href: `tel:${phone.replace(/\s/g, "")}`,
      icon: Phone,
      label: "Phone",
      value: phone,
      iconClass: "text-amber-400",
    },
    whatsapp && {
      key: "whatsapp",
      href: `https://wa.me/${whatsapp.replace(/\D/g, "")}`,
      icon: Phone,
      label: "WhatsApp",
      value: whatsapp,
      iconClass: "text-green-400",
      external: true,
    },
  ].filter(Boolean) as {
    key: string;
    href: string;
    icon: typeof Mail;
    label: string;
    value: string;
    iconClass: string;
    external?: boolean;
  }[];

  return (
    <section id="contact" className="bg-slate-900 py-20 text-white md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal variant="fadeLeft" duration={0.85}>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
                Get in Touch
              </p>
              <h2 className="text-3xl font-light tracking-wide md:text-5xl">{title}</h2>
              <p className="mt-6 text-base leading-relaxed text-slate-300 md:text-lg">{text}</p>
              <Link
                href="/book"
                className="mt-10 inline-block border border-white/40 px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition hover:bg-white hover:text-slate-900"
              >
                Book a Flight
              </Link>
            </div>
          </Reveal>

          <Stagger className="space-y-6" stagger={0.1}>
            {contactItems.map((item) => {
              const Icon = item.icon;
              return (
                <StaggerItem key={item.key} variant="fadeRight">
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="flex items-start gap-4 text-slate-300 transition hover:text-white"
                  >
                    <Icon className={`mt-1 h-5 w-5 shrink-0 ${item.iconClass}`} />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        {item.label}
                      </p>
                      <p className="mt-1">{item.value}</p>
                    </div>
                  </a>
                </StaggerItem>
              );
            })}
            {address && (
              <StaggerItem variant="fadeRight">
                <div className="flex items-start gap-4 text-slate-300">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-amber-400" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">Location</p>
                    <p className="mt-1">{address}</p>
                  </div>
                </div>
              </StaggerItem>
            )}
          </Stagger>
        </div>

        <Reveal variant="fade" delay={0.2} duration={0.8}>
          <div className="mt-16 border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Sitiawan Paramotor Club. All rights reserved.
          </div>
        </Reveal>
      </div>
    </section>
  );
}
