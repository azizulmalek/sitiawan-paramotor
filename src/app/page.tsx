import {
  getCmsContent,
  getHomepageOperators,
  getHomepageReviews,
  getCustomerPhotos,
} from "@/lib/cms";
import { mapCmsToHomepage } from "@/lib/homepage";
import HeroSection from "@/components/home/HeroSection";
import WhyTandemSection from "@/components/home/WhyTandemSection";
import SafetySection from "@/components/home/SafetySection";
import OperatorsSection from "@/components/home/OperatorsSection";
import ReviewsSection from "@/components/home/ReviewsSection";
import PricingSection from "@/components/home/PricingSection";
import ContactSection from "@/components/home/ContactSection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [cms, operators, reviews, customerPhotos] = await Promise.all([
    getCmsContent(),
    getHomepageOperators(),
    getHomepageReviews(),
    getCustomerPhotos(),
  ]);

  const content = mapCmsToHomepage(cms);

  return (
    <main className="overflow-x-hidden font-[family-name:var(--font-display)]">
      <HeroSection siteName={content.siteName} logoUrl={content.siteLogo || undefined} {...content.hero} />
      <WhyTandemSection {...content.whyTandem} />
      <SafetySection {...content.safety} />
      <OperatorsSection {...content.operators} operators={operators} />
      <ReviewsSection {...content.reviews} reviews={reviews} customerPhotos={customerPhotos} />
      <PricingSection />
      <ContactSection {...content.contact} />
    </main>
  );
}
