/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Only ignore errors in production builds
    ignoreBuildErrors: process.env.NODE_ENV === "production",
  },
  eslint: {
    // Only ignore errors in production builds
    ignoreDuringBuilds: process.env.NODE_ENV === "production",
  },
  output: "standalone",
  // Add support for public assets
  images: {
    domains: ["images.unsplash.com"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet, noimageindex",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
