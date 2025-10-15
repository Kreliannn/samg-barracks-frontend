import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // disable ESLint when building or deploying
  },
};

export default nextConfig;
