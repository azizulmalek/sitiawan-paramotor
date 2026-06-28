"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import OptimizedImage from "@/components/OptimizedImage";
import { EASE_OUT } from "./motion";

export type CustomerPhoto = {
  id: string;
  imageUrl: string;
  caption?: string | null;
};

const CARD_W = 152;
const CARD_GAP = 16;
const CENTER_H = 280;
const SIDE_H = 220;
const INTERVAL_MS = 3000;

function slotStyle(distance: number) {
  const d = Math.abs(distance);
  if (d === 0) return { opacity: 1, scale: 1.12, height: CENTER_H };
  if (d === 1) return { opacity: 0.5, scale: 1, height: SIDE_H };
  if (d === 2) return { opacity: 0.3, scale: 0.9, height: SIDE_H };
  return { opacity: 0, scale: 0.85, height: SIDE_H };
}

export default function CustomerGallery({
  photos,
  theme = "light",
}: {
  photos: CustomerPhoto[];
  theme?: "light" | "dark";
}) {
  const n = photos.length;
  const canSlide = n > 1;
  const extended = canSlide ? [...photos, ...photos, ...photos] : photos;

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [index, setIndex] = useState(canSlide ? n : 0);
  const [animate, setAnimate] = useState(true);
  const indexRef = useRef(index);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => setContainerWidth(el.offsetWidth);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const goTo = useCallback((next: number, withAnimation = true) => {
    setAnimate(withAnimation);
    indexRef.current = next;
    setIndex(next);
  }, []);

  const advance = useCallback(() => {
    if (!canSlide) return;
    const next = indexRef.current + 1;
    goTo(next, true);
    if (next >= n * 2) {
      setTimeout(() => goTo(n, false), 700);
    }
  }, [canSlide, n, goTo]);

  useEffect(() => {
    if (!canSlide) return;
    const timer = setInterval(advance, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [canSlide, advance]);

  if (n === 0) return null;

  const step = CARD_W + CARD_GAP;
  const trackOffset =
    containerWidth > 0 ? containerWidth / 2 - CARD_W / 2 - index * step : 0;

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden"
        style={{ height: CENTER_H + 24 }}
      >
        <motion.div
          className="absolute bottom-0 left-0 flex items-end"
          style={{ gap: CARD_GAP }}
          animate={{ x: trackOffset }}
          transition={{ duration: animate ? 0.7 : 0, ease: EASE_OUT }}
        >
          {extended.map((photo, i) => {
            const distance = i - index;
            const { opacity, scale, height } = slotStyle(distance);
            const isCenter = distance === 0;
            const show = Math.abs(distance) <= 2;

            if (!show) {
              return (
                <div
                  key={`${photo.id}-${i}`}
                  aria-hidden
                  style={{ width: CARD_W, height: SIDE_H, flexShrink: 0 }}
                />
              );
            }

            return (
              <motion.div
                key={`${photo.id}-${i}`}
                className="relative shrink-0 overflow-hidden rounded-lg shadow-md"
                animate={{ opacity, scale, height }}
                transition={{ duration: 0.7, ease: EASE_OUT }}
                style={{
                  width: CARD_W,
                  transformOrigin: "bottom center",
                  zIndex: 10 - Math.abs(distance),
                }}
              >
                <OptimizedImage
                  src={photo.imageUrl}
                  alt={photo.caption || "Happy customer"}
                  fill
                  sizes={`${CARD_W}px`}
                  quality={75}
                  className="object-cover"
                />
                {isCenter && photo.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="truncate text-center text-xs text-white">{photo.caption}</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {canSlide && (
        <div className="mt-3 flex justify-center gap-1.5">
          {photos.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(n + i, true)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index % n === i
                  ? "w-5 bg-sky-400"
                  : theme === "dark"
                    ? "w-1.5 bg-white/35 hover:bg-white/55"
                    : "w-1.5 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
