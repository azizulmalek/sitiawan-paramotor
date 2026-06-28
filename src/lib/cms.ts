import { prisma } from "./db";

export const CMS_KEYS = {
  siteName: "site_name",
  siteTagline: "site_tagline",
  siteLogo: "site_logo",
  heroImage: "hero_image",
  heroTitle: "hero_title",
  heroSubtitle: "hero_subtitle",
  whyTandemTitle: "why_tandem_title",
  whyTandemText: "why_tandem_text",
  whyTandemImage: "why_tandem_image",
  safetyTitle: "safety_title",
  safetyText: "safety_text",
  safetyImage: "safety_image",
  operatorsTitle: "operators_title",
  operatorsSubtitle: "operators_subtitle",
  reviewsTitle: "reviews_title",
  reviewsSubtitle: "reviews_subtitle",
  contactTitle: "contact_title",
  contactText: "contact_text",
  contactEmail: "contact_email",
  contactPhone: "contact_phone",
  contactAddress: "contact_address",
  contactWhatsapp: "contact_whatsapp",
  bookingIntro: "booking_intro",
  aboutTitle: "about_title",
  aboutContent: "about_content",
  servicesTitle: "services_title",
  service1Title: "service_1_title",
  service1Content: "service_1_content",
  service2Title: "service_2_title",
  service2Content: "service_2_content",
  service3Title: "service_3_title",
  service3Content: "service_3_content",
} as const;

export type CmsKey = (typeof CMS_KEYS)[keyof typeof CMS_KEYS];

export type CmsItem = {
  key: string;
  title: string | null;
  content: string;
  imageUrl: string | null;
};

export async function getCmsItems(): Promise<CmsItem[]> {
  return prisma.cmsContent.findMany({ orderBy: { key: "asc" } });
}

export async function getCmsContent(): Promise<Record<string, string>> {
  const items = await prisma.cmsContent.findMany();
  const map: Record<string, string> = {};
  for (const item of items) {
    map[item.key] = item.content || item.imageUrl || "";
    if (item.title) map[`${item.key}_title`] = item.title;
    if (item.imageUrl) map[`${item.key}_image`] = item.imageUrl;
  }
  return map;
}

export async function getCmsValue(key: string, fallback = "") {
  const item = await prisma.cmsContent.findUnique({ where: { key } });
  return item?.content ?? fallback;
}

export async function getHomepageOperators() {
  return prisma.operator.findMany({
    where: { active: true, showOnHomepage: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getHomepageReviews() {
  return prisma.review.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getCustomerPhotos() {
  return prisma.customerPhoto.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
}
