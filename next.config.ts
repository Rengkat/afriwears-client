import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Keep your old domains in remotePatterns or domains
    domains: ["cdn.sanity.io"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.example.com',
        pathname: '/**', 
      },
      // You can add more patterns here for other domains
    ],
  },
};

export default nextConfig;