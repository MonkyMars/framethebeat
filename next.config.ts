import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'albumartexchange.com',
      }
    ]
  }
};

export default nextConfig;
