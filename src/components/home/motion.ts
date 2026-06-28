import type { Transition, Variants } from "framer-motion";

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_HERO = [0.16, 1, 0.3, 1] as const;

export const VIEWPORT = {
  once: true,
  amount: 0.18,
  margin: "0px 0px -48px 0px",
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -28 },
  visible: { opacity: 1, y: 0 },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -44 },
  visible: { opacity: 1, x: 0 },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 44 },
  visible: { opacity: 1, x: 0 },
};

export const zoomIn: Variants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: { opacity: 1, scale: 1 },
};

export const zoomOut: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1 },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const VARIANTS = {
  fadeUp,
  fadeDown,
  fadeLeft,
  fadeRight,
  zoomIn,
  zoomOut,
  fade,
} as const;

export type RevealVariant = keyof typeof VARIANTS;

export function revealTransition(
  duration = 0.75,
  delay = 0
): Transition {
  return { duration, delay, ease: EASE_OUT };
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};
