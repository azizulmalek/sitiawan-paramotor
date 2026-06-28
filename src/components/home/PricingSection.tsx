"use client";

import Link from "next/link";
import { Check, Tag } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { Reveal } from "./Reveal";

const PLANS = [
  {
    id: "solo",
    badge: "Most Popular",
    title: "Solo Flight",
    duration: "20 minutes",
    audience: "1 pax · Ages 13 to adult",
    originalPrice: 189,
    price: 150,
    highlight: true,
    features: [
      "Full tandem paramotor experience",
      "Certified pilot & safety briefing",
      "Ideal for first-time flyers",
    ],
    note: "Perfect if you're flying solo.",
  },
  {
    id: "adult-child",
    badge: "Family Add-On",
    title: "Adult + Child",
    duration: "20 minutes",
    audience: "1 adult + 1 child (5–12 yrs)",
    originalPrice: 239,
    price: 200,
    priceBreakdown: "RM150 adult + RM50 child",
    highlight: false,
    features: [
      "Child must be accompanied by an adult",
      "Same 20-minute tandem flight",
      "Great introduction for young adventurers",
    ],
    note: "Child add-on: +RM50 on top of adult fare.",
  },
  {
    id: "duo",
    badge: "Best Value",
    title: "2 Pax Package",
    duration: "20 minutes each",
    audience: "2 pax · Ages 13 to adult",
    originalPrice: 378,
    price: 300,
    highlight: false,
    features: [
      "Fly together with a friend or partner",
      "Free ride for 1 child (ages 5–12)",
      "Share the sky — unforgettable memories",
    ],
    note: "Bring a child 5–12 and they fly free.",
  },
];

export default function PricingSection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeader
          className="mb-14 md:mb-16"
          eyebrow="Limited-Time Offer"
          title="Take Flight for Less"
          subtitle="Book your 20-minute tandem paramotor experience at our special promotional rates."
        />

        <div className="grid gap-8 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal
              key={plan.id}
              variant="fadeUp"
              delay={i * 0.1}
              duration={0.7}
              className={`relative flex flex-col rounded-xl border p-8 transition hover:shadow-lg ${
                plan.highlight
                  ? "border-sky-600 bg-sky-50/50 shadow-md ring-1 ring-sky-600/20"
                  : "border-slate-200 bg-stone-50"
              }`}
            >
              {plan.badge && (
                <span
                  className={`mb-4 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                    plan.highlight
                      ? "bg-sky-600 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {plan.highlight && <Tag className="h-3 w-3" />}
                  {plan.badge}
                </span>
              )}

              <h3 className="text-2xl font-light tracking-wide text-slate-900">{plan.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{plan.duration}</p>
              <p className="mt-2 text-sm font-medium text-sky-700">{plan.audience}</p>

              <div className="mt-6 border-b border-slate-200 pb-6">
                <p className="text-lg text-slate-400 line-through">RM{plan.originalPrice}</p>
                <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-4xl font-light text-slate-900 md:text-5xl">
                    RM{plan.price}
                  </span>
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-800">
                    Save RM{plan.originalPrice - plan.price}
                  </span>
                </div>
                {plan.priceBreakdown && (
                  <p className="mt-1 text-sm text-slate-500">{plan.priceBreakdown}</p>
                )}
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                    {feature}
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-xs text-slate-500">{plan.note}</p>

              <Link
                href={`/book?package=${plan.id}`}
                className={`mt-8 block w-full py-3 text-center text-xs font-semibold uppercase tracking-[0.15em] transition ${
                  plan.highlight
                    ? "bg-sky-600 text-white hover:bg-sky-700"
                    : "border border-slate-300 bg-white text-slate-800 hover:border-sky-600 hover:text-sky-700"
                }`}
              >
                Book Now
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal variant="fade" delay={0.3} duration={0.7}>
          <p className="mt-10 text-center text-xs text-slate-500">
            All prices in Malaysian Ringgit (RM). Children aged 5–12 must fly with an
            accompanying adult. Promotional rates subject to availability.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
