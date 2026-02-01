/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
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
