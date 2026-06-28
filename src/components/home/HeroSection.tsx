"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import OptimizedImage from "@/components/OptimizedImage";
import HeroHeader from "./HeroHeader";
import { EASE_HERO, EASE_OUT } from "./motion";

type HeroSectionProps = {
  siteName: string;
  logoUrl?: string;
  imageUrl: string;
  title: string;
  subtitle: string;
};

const contentVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.55 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE_OUT },
  },
};

export default function HeroSection({
  siteName,
  logoUrl,
  imageUrl,
  title,
  subtitle,
}: HeroSectionProps) {
  const reduce = useReducedMotion();

  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={reduce ? false : { scale: 1.18 }}
        animate={{ scale: 1 }}
        transition={{ duration: 4.8, ease: EASE_HERO }}
      >
        <OptimizedImage
          src={imageUrl}
          alt="Paramotor flying high above the landscape"
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

      <HeroHeader siteName={siteName} logoUrl={logoUrl} />

      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-end px-6 pb-24 text-center text-white md:pb-32">
        <motion.div
          className="pointer-events-auto flex w-full max-w-4xl flex-col items-center"
          initial={reduce ? false : "hidden"}
          animate="visible"
          variants={contentVariants}
        >
          <motion.p
            variants={itemVariants}
            className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-white/80 md:text-sm"
          >
            Tandem Flights · Sitiawan
          </motion.p>
          <motion.h1
            variants={itemVariants}
            className="max-w-4xl text-3xl font-light leading-tight tracking-wide md:text-5xl lg:text-6xl"
          >
            {title}
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-2xl text-sm leading-relaxed text-white/85 md:text-lg"
          >
            {subtitle}
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link
              href="/book"
              className="mt-10 inline-block border border-white/60 px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-slate-900 md:text-sm"
            >
              Book Your Flight
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <div className="animate-bounce">
          <div className="h-10 w-6 rounded-full border-2 border-white/50 p-1">
            <div className="mx-auto h-2 w-1 rounded-full bg-white/70" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
