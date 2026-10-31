import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    agentFeedback: true,
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "placehold.co" }],
  },
  async rewrites() {
    return [
      { source: "/products", destination: "/api/products" },
      { source: "/products/:slug", destination: "/api/products/:slug" },
      { source: "/categories", destination: "/api/categories" },
      { source: "/checkout/quote", destination: "/api/checkout/quote" },
      { source: "/auth/login", destination: "/api/auth/login" },
      { source: "/admin/:path*", destination: "/api/admin/:path*" },
      { source: "/orders/guest/:orderNumber", destination: "/api/orders/guest/:orderNumber" },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
