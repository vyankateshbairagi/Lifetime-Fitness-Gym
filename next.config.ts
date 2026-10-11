import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  async redirects() {
    return [
      {
        source: "/facilities",
        destination: "/#services",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
