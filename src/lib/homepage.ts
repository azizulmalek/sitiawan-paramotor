import { CMS_KEYS } from "./cms";

export const DEFAULT_IMAGES = {
  hero: "https://images.unsplash.com/photo-1506947411487-a5673826738d?w=1920&q=80",
  whyTandem: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80",
  safety: "https://images.unsplash.com/photo-1454496526348-38a048a0e9ab?w=1920&q=80",
} as const;

export const HOMEPAGE_DEFAULTS = {
  siteName: "Sitiawan Paramotor Club",
  hero: {
    title: "See the World From Above",
    subtitle:
      "Tandem paramotor flights over Sitiawan — a perspective you will never forget.",
  },
  whyTandem: {
    title: "Why Try Paramotor Tandem?",
    text: "There is nothing quite like the sensation of open-air flight. With a certified tandem operator at the controls, you can experience the freedom of flying without years of training. Soar over coastlines, rivers, and lush Malaysian landscapes — feeling the wind, witnessing breathtaking views, and creating memories that last a lifetime.",
  },
  safety: {
    title: "Safety Is Everything",
    text: "Every flight begins with a thorough safety briefing and equipment check. Our operators are certified, our gear is meticulously maintained, and weather conditions are assessed before every takeoff. We never compromise on safety — because your trust is our highest priority.",
  },
  operators: {
    title: "Your Pilots",
    subtitle: "Meet the certified tandem operators who will guide your adventure.",
  },
  reviews: {
    title: "What Our Guests Say",
    subtitle: "Real experiences from adventurers who took to the skies with us.",
  },
  contact: {
    title: "Start Your Adventure",
    text: "Ready to fly? Reach out with any questions or book your tandem flight online.",
    email: "info@sitiawanparamotor.com",
    phone: "+60 12-345 6789",
    address: "Sitiawan, Perak, Malaysia",
  },
} as const;

export function mapCmsToHomepage(cms: Record<string, string>) {
  const d = HOMEPAGE_DEFAULTS;
  return {
    siteName: cms[CMS_KEYS.siteName] || d.siteName,
    siteLogo: cms[CMS_KEYS.siteLogo] || "",
    hero: {
      imageUrl: cms[CMS_KEYS.heroImage] || DEFAULT_IMAGES.hero,
      title: cms[CMS_KEYS.heroTitle] || d.hero.title,
      subtitle: cms[CMS_KEYS.heroSubtitle] || d.hero.subtitle,
    },
    whyTandem: {
      title: cms[CMS_KEYS.whyTandemTitle] || d.whyTandem.title,
      text: cms[CMS_KEYS.whyTandemText] || d.whyTandem.text,
      imageUrl: cms[CMS_KEYS.whyTandemImage] || DEFAULT_IMAGES.whyTandem,
    },
    safety: {
      title: cms[CMS_KEYS.safetyTitle] || d.safety.title,
      text: cms[CMS_KEYS.safetyText] || d.safety.text,
      imageUrl: cms[CMS_KEYS.safetyImage] || DEFAULT_IMAGES.safety,
    },
    operators: {
      title: cms[CMS_KEYS.operatorsTitle] || d.operators.title,
      subtitle: cms[CMS_KEYS.operatorsSubtitle] || d.operators.subtitle,
    },
    reviews: {
      title: cms[CMS_KEYS.reviewsTitle] || d.reviews.title,
      subtitle: cms[CMS_KEYS.reviewsSubtitle] || d.reviews.subtitle,
    },
    contact: {
      title: cms[CMS_KEYS.contactTitle] || d.contact.title,
      text: cms[CMS_KEYS.contactText] || d.contact.text,
      email: cms[CMS_KEYS.contactEmail] || d.contact.email,
      phone: cms[CMS_KEYS.contactPhone] || d.contact.phone,
      address: cms[CMS_KEYS.contactAddress] || d.contact.address,
      whatsapp: cms[CMS_KEYS.contactWhatsapp] || undefined,
    },
  };
}
