"use client";

import { Star } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";
import SectionHeader from "./SectionHeader";
import CustomerGallery, { type CustomerPhoto } from "./CustomerGallery";
import { Reveal } from "./Reveal";

const REVIEWS_BG = "/images/reviews-background.png";

type Review = {
  id: string;
  author: string;
  text: string;
  rating: number;
  location: string | null;
};

type ReviewsSectionProps = {
  title: string;
  subtitle: string;
  reviews: Review[];
  customerPhotos: CustomerPhoto[];
};

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < count ? "fill-amber-400 text-amber-400" : "text-white/30"}`}
        />
      ))}
    </div>
  );
}

export default function ReviewsSection({
  title,
  subtitle,
  reviews,
  customerPhotos,
}: ReviewsSectionProps) {
  if (reviews.length === 0 && customerPhotos.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-14 md:py-20">
      <div className="absolute inset-0">
        <OptimizedImage
          src={REVIEWS_BG}
          alt=""
          fill
          sizes="100vw"
          quality={80}
          className="object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/55 via-slate-900/65 to-slate-900/80" />

      <div className="relative">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <SectionHeader
            className="mb-6 md:mb-8"
            eyebrow="Guest Experiences"
            title={title}
            subtitle={subtitle}
            eyebrowClass="text-sky-300"
            titleClass="text-white"
            subtitleClass="text-slate-200"
          />
        </div>

        {customerPhotos.length > 0 && (
          <Reveal variant="fadeUp" duration={0.9} className="mb-8 w-full md:mb-10">
            <CustomerGallery photos={customerPhotos} theme="dark" />
          </Reveal>
        )}

        {reviews.length > 0 && (
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
              {reviews.map((review, i) => (
                <Reveal
                  key={review.id}
                  variant="fadeUp"
                  delay={i * 0.1}
                  duration={0.7}
                >
                  <blockquote className="flex h-full flex-col border border-white/15 bg-white/10 p-6 backdrop-blur-sm md:p-8">
                    <Stars count={review.rating} />
                    <p className="mt-4 flex-1 text-base leading-relaxed text-slate-100 md:mt-6">
                      &ldquo;{review.text}&rdquo;
                    </p>
                    <footer className="mt-4 border-t border-white/15 pt-4 md:mt-6">
                      <cite className="not-italic font-semibold text-white">
                        {review.author}
                      </cite>
                      {review.location && (
                        <p className="text-sm text-slate-300">{review.location}</p>
                      )}
                    </footer>
                  </blockquote>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
