/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // Required for GitHub Pages
  },
  output: 'export', // Export static files
  trailingSlash: true, // Fixes routing on static hosting
  basePath: '/heykeralaproject', // 👈 folder/repo name
  assetPrefix: '/heykeralaproject/', // 👈 same as above
};

export default nextConfig;
