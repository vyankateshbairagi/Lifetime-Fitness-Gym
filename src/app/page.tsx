import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/public/announcement-bar";
import { Navbar } from "@/components/public/navbar";
import { Hero } from "@/components/public/hero";
import { About } from "@/components/public/about";
import { Services } from "@/components/public/services";
import { FreeTrialForm } from "@/components/public/free-trial-form";
import { Trainers } from "@/components/public/trainers";
import { MembershipPlans } from "@/components/public/membership-plans";
import { Gallery } from "@/components/public/gallery";
import { Testimonials } from "@/components/public/testimonials";
import { LocationContact } from "@/components/public/location-contact";
import { Faq } from "@/components/public/faq";
import { Footer } from "@/components/public/footer";
import { FloatingWhatsAppButton } from "@/components/public/whatsapp-button";
import { BackToTop } from "@/components/public/back-to-top";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "LifeTime Fitness Gym | Build Strength. Build Confidence. Become Your Best.",
  description:
    "LifeTime Fitness Gym in Guruwar Peth, Pune. Build strength, improve fitness, and become your best with quality equipment, training support, and flexible membership options.",
  openGraph: {
    title: "LifeTime Fitness Gym | Pune",
    description:
      "Join LifeTime Fitness Gym in Guruwar Peth, Pune. Quality equipment, floor trainer guidance, and flexible membership plans.",
    type: "website",
    url: "https://lifetimefitnessgym.com",
    images: [
      {
        url: "/photos/img_0600.webp",
        width: 1200,
        height: 630,
        alt: "LifeTime Fitness Gym Pune",
      },
    ],
  },
};

async function getPublicPlans() {
  try {
    const slug = process.env.PUBLIC_ORGANIZATION_SLUG?.trim() || "lifetime-fitness-gym";
    const organization = await db.organization.findFirst({
      where: { slug, isActive: true },
      select: {
        plans: {
          where: { isActive: true },
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            name: true,
            price: true,
            durationInDays: true,
            description: true,
          },
        },
      },
    });

    return (organization?.plans ?? []).map((p) => ({
      ...p,
      price: p.price.toString(),
    }));
  } catch (error) {
    console.error("Failed to retrieve public membership plans:", error);
    return [];
  }
}

export default async function HomePage() {
  const plans = await getPublicPlans();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HealthClub",
    name: "LifeTime Fitness Gym",
    image: "https://lifetimefitnessgym.com/photos/img_0600.webp",
    telephone: "+918446648527",
    address: {
      "@type": "PostalAddress",
      streetAddress: "732, Chhatrapati Shivaji Maharaj Rd, near Rashtrabhushan Chowk, Guruwar Peth",
      addressLocality: "Pune",
      addressRegion: "Maharashtra",
      postalCode: "411042",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "18.5085",
      longitude: "73.8567",
    },
    url: "https://lifetimefitnessgym.com",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "06:00",
        closes: "10:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "16:00",
        closes: "22:00",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white selection:bg-red-600 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <FreeTrialForm />
        <Trainers />
        <MembershipPlans plans={plans} />
        <Gallery />
        <Testimonials />
        <LocationContact />
        <Faq />
      </main>
      <Footer />
      <FloatingWhatsAppButton />
      <BackToTop />
    </div>
  );
}
