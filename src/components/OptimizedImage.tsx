import Image from "next/image";

type OptimizedImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
  quality?: number;
};

export default function OptimizedImage({
  src,
  alt,
  fill,
  width,
  height,
  priority = false,
  className = "",
  sizes = "100vw",
  quality = 80,
}: OptimizedImageProps) {
  if (!src) return null;

  const baseClass = fill ? `object-cover ${className}` : className;

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        quality={quality}
        className={baseClass}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 800}
      height={height ?? 600}
      priority={priority}
      sizes={sizes}
      quality={quality}
      className={baseClass}
    />
  );
}
