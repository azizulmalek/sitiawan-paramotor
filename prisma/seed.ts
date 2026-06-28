import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { CMS_KEYS } from "../src/lib/cms";

const prisma = new PrismaClient();

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1506947411487-a5673826738d?w=1920&q=80",
  whyTandem: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80",
  safety: "https://images.unsplash.com/photo-1454496526348-38a048a0e9ab?w=1920&q=80",
  operator1: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80",
  operator2: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80",
  operator3: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80",
  operator4: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
};

async function upsertCms(
  key: string,
  content: string,
  opts?: { title?: string; imageUrl?: string }
) {
  await prisma.cmsContent.upsert({
    where: { key },
    update: {
      content,
      title: opts?.title ?? null,
      imageUrl: opts?.imageUrl ?? null,
    },
    create: {
      key,
      content,
      title: opts?.title ?? null,
      imageUrl: opts?.imageUrl ?? null,
    },
  });
}

async function main() {
  const password = await bcrypt.hash("admin123", 10);

  await prisma.admin.upsert({
    where: { email: "admin@paramotorclub.com" },
    update: {},
    create: {
      email: "admin@paramotorclub.com",
      password,
      name: "Club Admin",
    },
  });

  await upsertCms(CMS_KEYS.siteName, "Sitiawan Paramotor Club");
  await upsertCms(CMS_KEYS.siteTagline, "Tandem Flights · Perak, Malaysia");
  await upsertCms(CMS_KEYS.siteLogo, "");
  await upsertCms(CMS_KEYS.heroImage, IMAGES.hero, { imageUrl: IMAGES.hero });
  await upsertCms(CMS_KEYS.heroTitle, "See the World From Above");
  await upsertCms(
    CMS_KEYS.heroSubtitle,
    "Tandem paramotor flights over Sitiawan — a breathtaking perspective you will never forget. Fly with certified operators above Malaysia's stunning coastline."
  );
  await upsertCms(CMS_KEYS.whyTandemImage, IMAGES.whyTandem, { imageUrl: IMAGES.whyTandem });
  await upsertCms(CMS_KEYS.whyTandemTitle, "Why Try Paramotor Tandem?");
  await upsertCms(
    CMS_KEYS.whyTandemText,
    "There is nothing quite like the sensation of open-air flight. With a certified tandem operator at the controls, you can experience the freedom of flying without years of training. Soar over coastlines, rivers, and lush Malaysian landscapes — feeling the wind, witnessing breathtaking views, and creating memories that last a lifetime."
  );
  await upsertCms(CMS_KEYS.safetyImage, IMAGES.safety, { imageUrl: IMAGES.safety });
  await upsertCms(CMS_KEYS.safetyTitle, "Safety Is Everything");
  await upsertCms(
    CMS_KEYS.safetyText,
    "Every flight begins with a thorough safety briefing and equipment check. Our operators are certified, our gear is meticulously maintained, and weather conditions are assessed before every takeoff. We never compromise on safety — because your trust is our highest priority."
  );
  await upsertCms(CMS_KEYS.operatorsTitle, "Your Pilots");
  await upsertCms(
    CMS_KEYS.operatorsSubtitle,
    "Meet the certified tandem operators who will guide your adventure over Sitiawan."
  );
  await upsertCms(CMS_KEYS.reviewsTitle, "What Our Guests Say");
  await upsertCms(
    CMS_KEYS.reviewsSubtitle,
    "Real experiences from adventurers who took to the skies with us."
  );
  await upsertCms(CMS_KEYS.contactTitle, "Start Your Adventure");
  await upsertCms(
    CMS_KEYS.contactText,
    "Ready to fly? Reach out with any questions or book your tandem flight online. We fly weekends and special dates throughout the year."
  );
  await upsertCms(CMS_KEYS.contactEmail, "info@sitiawanparamotor.com");
  await upsertCms(CMS_KEYS.contactPhone, "+60 12-345 6789");
  await upsertCms(CMS_KEYS.contactWhatsapp, "+60123456789");
  await upsertCms(CMS_KEYS.contactAddress, "Sitiawan, Perak, Malaysia");
  await upsertCms(
    CMS_KEYS.bookingIntro,
    "Select your preferred date and 30-minute time slot. Each slot supports multiple tandem operators — book early to secure your spot!"
  );
  await upsertCms(CMS_KEYS.aboutTitle, "About Sitiawan Paramotor Club");
  await upsertCms(
    CMS_KEYS.aboutContent,
    "Based in Sitiawan, Perak, our club offers safe and exhilarating tandem paramotor flights for adventurers of all experience levels. Our certified operators provide world-class instruction and unforgettable aerial experiences over stunning Malaysian landscapes."
  );
  await upsertCms(CMS_KEYS.servicesTitle, "Our Experiences");

  const days = [
    { dayOfWeek: 0, startTime: "08:00", endTime: "16:00" },
    { dayOfWeek: 6, startTime: "08:00", endTime: "16:00" },
  ];

  for (const day of days) {
    const existing = await prisma.availabilityRule.findFirst({
      where: { dayOfWeek: day.dayOfWeek },
    });
    if (!existing) {
      await prisma.availabilityRule.create({ data: day });
    }
  }

  const operators = [
    {
      name: "Ahmad Razak",
      email: "ahmad@sitiawanparamotor.com",
      experience: "600+ tandem flights · 10 years flying",
      background: "Former commercial pilot, paramotor instructor since 2015",
      certifications: "APPI Tandem Certified · First Aid",
      bio: "Passionate about sharing the joy of flight with first-time flyers over Sitiawan's beautiful coastline.",
      photoUrl: IMAGES.operator1,
      sortOrder: 0,
    },
    {
      name: "Wei Lim",
      email: "wei@sitiawanparamotor.com",
      experience: "400+ flights · Competition pilot",
      background: "National paramotor competitor, aviation sports enthusiast",
      certifications: "APPI Tandem · Advanced Weather",
      bio: "Known for smooth landings and calm guidance — perfect for nervous first-timers.",
      photoUrl: IMAGES.operator2,
      sortOrder: 1,
    },
    {
      name: "Kumar Selvam",
      email: "kumar@sitiawanparamotor.com",
      experience: "350+ flights · 7 years experience",
      background: "Adventure tourism specialist, Sitiawan local guide",
      certifications: "APPI Tandem Certified",
      bio: "Shares local knowledge and stunning routes only visible from the air.",
      photoUrl: IMAGES.operator3,
      sortOrder: 2,
    },
    {
      name: "Daniel Ong",
      email: "daniel@sitiawanparamotor.com",
      experience: "500+ flights · Sunset specialist",
      background: "Photography and aerial tourism expert",
      certifications: "APPI Tandem · Rescue Trained",
      bio: "Specialises in golden-hour flights for the most magical aerial photography.",
      photoUrl: IMAGES.operator4,
      sortOrder: 3,
    },
  ];

  for (const op of operators) {
    const existing = await prisma.operator.findFirst({ where: { email: op.email } });
    if (!existing) {
      await prisma.operator.create({ data: op });
    } else {
      await prisma.operator.update({
        where: { id: existing.id },
        data: op,
      });
    }
  }

  const reviewCount = await prisma.review.count();
  if (reviewCount === 0) {
    await prisma.review.createMany({
      data: [
        {
          author: "Sarah Tan",
          location: "Kuala Lumpur",
          rating: 5,
          text: "Absolutely incredible experience! The views over Sitiawan were breathtaking and Ahmad made me feel completely safe throughout. Already planning my next flight!",
          sortOrder: 0,
        },
        {
          author: "James Mitchell",
          location: "Singapore",
          rating: 5,
          text: "As someone terrified of heights, I was nervous — but Wei was so reassuring. Best adventure I've had in Malaysia. Cannot recommend enough.",
          sortOrder: 1,
        },
        {
          author: "Nurul Huda",
          location: "Ipoh, Perak",
          rating: 5,
          text: "Booked a sunset flight for my husband's birthday. Daniel was fantastic and the golden hour views were magical. Professional team from start to finish.",
          sortOrder: 2,
        },
      ],
    });
  }

  const customerPhotoCount = await prisma.customerPhoto.count();
  if (customerPhotoCount === 0) {
    const galleryImages = [
      { imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80", caption: "First tandem flight!", sortOrder: 0 },
      { imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80", caption: "Sunset over Sitiawan", sortOrder: 1 },
      { imageUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&q=80", caption: "Birthday surprise", sortOrder: 2 },
      { imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80", caption: "Thumbs up!", sortOrder: 3 },
      { imageUrl: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&q=80", caption: "Family adventure", sortOrder: 4 },
      { imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80", caption: "Unforgettable views", sortOrder: 5 },
    ];
    await prisma.customerPhoto.createMany({ data: galleryImages });
  }

  console.log("Seed completed.");
  console.log("Admin login: admin@paramotorclub.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
