import Link from "next/link";
import Image from "next/image";
import { Wind } from "lucide-react";

type SiteBrandProps = {
  siteName: string;
  logoUrl?: string;
  variant?: "light" | "dark";
  className?: string;
};

export default function SiteBrand({
  siteName,
  logoUrl,
  variant = "dark",
  className = "",
}: SiteBrandProps) {
  const isLight = variant === "light";

  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 ${isLight ? "text-white drop-shadow-md" : "font-bold text-sky-800"} ${className}`}
    >
      {logoUrl ? (
        <span className="relative h-9 w-28 shrink-0 md:h-10 md:w-32">
          <Image
            src={logoUrl}
            alt={`${siteName} logo`}
            fill
            sizes="128px"
            className="object-contain object-left"
          />
        </span>
      ) : (
        <Wind
          className={`h-7 w-7 shrink-0 ${isLight ? "text-white" : "text-sky-600"}`}
          strokeWidth={1.5}
        />
      )}
      <span
        className={`text-sm uppercase tracking-[0.15em] md:text-base ${
          isLight ? "font-semibold tracking-[0.2em]" : "font-bold tracking-wider"
        }`}
      >
        {siteName}
      </span>
    </Link>
  );
}
