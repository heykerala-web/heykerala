import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_ENABLE_SW !== "true",
  register: true,
  skipWaiting: true,
  fallbacks: {
    document: "/offline",
    image: "/offline-image.png",
  },
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts-webfonts",
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "google-fonts-stylesheets",
      },
    },
    {
      urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "static-font-assets",
      },
    },
    {
      urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "static-image-assets",
      },
    },
    {
      urlPattern: /\/_next\/image\?url=.+/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "next-image",
      },
    },
    {
      urlPattern: /\.(?:js)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-js-assets",
      },
    },
    {
      urlPattern: /\.(?:css|less)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-style-assets",
      },
    },
    {
      urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "next-data",
      },
    },
    {
      urlPattern: /\/api\/users\/saved/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-wishlist",
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
    {
      urlPattern: /\/api\/users\/me/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "user-data",
        networkTimeoutSeconds: 5,
      },
    },
    {
      urlPattern: /\/api\/places\/[a-f0-9]{24}$/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "place-details",
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
    {
      urlPattern: /\/api\/places.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-places",
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\/api\/stays\/[a-f0-9]{24}$/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "stay-details",
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
    {
      urlPattern: /\/api\/stays.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-stays",
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\/api\/events\/[a-f0-9]{24}$/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "event-details",
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
    {
      urlPattern: /\/api\/events.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-events",
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "others",
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
  ],
});

const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  swcMinify: true,

  // Memory optimization for build process
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400, // 24 hours
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
  productionBrowserSourceMaps: false, // Disable source maps in production to save memory

  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns", "lodash", "recharts"],
    // Lower memory consumption during build
    webpackBuildWorker: true,
    parallelServerCompiles: false,
    parallelServerBuildTraces: false,
  },

  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
  },
};

export default withPWA(nextConfig);
