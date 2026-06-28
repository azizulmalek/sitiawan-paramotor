import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCmsContent, CMS_KEYS } from "@/lib/cms";
import { HOMEPAGE_DEFAULTS } from "@/lib/homepage";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const cms = await getCmsContent();
  const siteName = cms[CMS_KEYS.siteName] || HOMEPAGE_DEFAULTS.siteName;
  const logoUrl = cms[CMS_KEYS.siteLogo] || "";

  return (
    <>
      <Navbar siteName={siteName} logoUrl={logoUrl || undefined} />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
