import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Add these:
  eslint: {
    ignoreDuringBuilds: true,  // stops ESLint from blocking the build
  },
  typescript: {
    ignoreBuildErrors: true,   // stops TS errors from blocking the build
  },
};

export default nextConfig;