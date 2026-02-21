import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dna-tools.co.kr",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/request/:path*",
        destination: "http://localhost:8080/:path*",
      },
      {
        source: "/images/:path*",
        destination: "http://localhost:8080/images/:path*",
      },
    ];
  },
};

export default nextConfig;
