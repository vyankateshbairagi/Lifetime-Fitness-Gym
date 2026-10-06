import type { Metadata } from "next";
import "./globals.css";

// Note: intentionally not using next/font/google here — this build
// environment blocks network access to Google Fonts. System fonts avoid an
// unnecessary build-time network dependency; swap in next/font later if
// you want a custom typeface.

export const metadata: Metadata = {
  title: "Lifetime Fitness Gym",
  description: "Train with purpose. Move better. Build your best routine.",
  applicationName: "Lifetime Fitness Gym",
  openGraph: {
    title: "Lifetime Fitness Gym",
    description: "Train with purpose. Move better. Build your best routine.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Lifetime Fitness Gym",
    description: "Train with purpose. Move better. Build your best routine.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
