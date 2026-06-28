import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Sitiawan Paramotor Club — Tandem Flights",
  description:
    "Experience breathtaking paramotor tandem flights over Sitiawan. Book your adventure with certified operators.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="overflow-x-hidden font-sans antialiased">{children}</body>
    </html>
  );
}
