/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },

  compress: true,

  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns", "lodash", "recharts"],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*", // Backend URL
      },
      {
        source: "/uploads/:path*",
        destination: "http://localhost:5000/uploads/:path*", // Serve uploaded images
      },
    ];
  },
};

export default nextConfig;
