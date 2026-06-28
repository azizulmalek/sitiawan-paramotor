import path from "path";

/** Directory where CMS uploads are stored. Use a Railway volume path in production. */
export function getUploadDir(): string {
  const configured = process.env.UPLOAD_DIR?.trim();
  if (configured) {
    return path.isAbsolute(configured)
      ? configured
      : path.join(process.cwd(), configured);
  }
  return path.join(process.cwd(), "public", "uploads");
}

/** Public URL path for an uploaded filename. */
export function getUploadPublicPath(filename: string): string {
  return `/uploads/${filename}`;
}
