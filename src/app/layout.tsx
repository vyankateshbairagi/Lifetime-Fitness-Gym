import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lifetimefitnessgym.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "LifeTime Fitness Gym | Build Strength. Build Confidence. Become Your Best.",
  description:
    "LifeTime Fitness Gym in Guruwar Peth, Pune. Build strength, improve fitness, and become your best with quality equipment, training support, and flexible membership options.",
  applicationName: "LifeTime Fitness Gym",
  keywords: [
    "gym in pune",
    "lifetime fitness gym",
    "gym guruwar peth pune",
    "fitness center pune",
    "weight training pune",
    "personal trainer pune",
    "fitness memberships pune",
  ],
  authors: [{ name: "LifeTime Fitness Gym" }],
  creator: "LifeTime Fitness Gym",
  publisher: "LifeTime Fitness Gym",
  formatDetection: {
    telephone: true,
    address: true,
  },
  openGraph: {
    title: "LifeTime Fitness Gym | Build Strength. Build Confidence.",
    description:
      "Premier fitness center in Guruwar Peth, Pune. Dedicated trainers, modern equipment, and flexible membership options.",
    url: siteUrl,
    siteName: "LifeTime Fitness Gym",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/photos/img_0600.webp",
        width: 1200,
        height: 630,
        alt: "LifeTime Fitness Gym Pune Workout Floor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LifeTime Fitness Gym | Pune",
    description:
      "Premier fitness center in Guruwar Peth, Pune. Dedicated trainers, modern equipment, and flexible memberships.",
    images: ["/photos/img_0600.webp"],
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
