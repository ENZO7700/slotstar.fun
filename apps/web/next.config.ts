import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'slotstars.kestudio.sk',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'slotstars.kestudio.sk',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
