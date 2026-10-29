import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://lifetimefitnessgym.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/dashboard/*",
          "/members",
          "/members/*",
          "/plans/*",
          "/subscriptions",
          "/subscriptions/*",
          "/payments",
          "/payments/*",
          "/attendance",
          "/attendance/*",
          "/expenses",
          "/expenses/*",
          "/reports",
          "/reports/*",
          "/settings",
          "/settings/*",
          "/api/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

