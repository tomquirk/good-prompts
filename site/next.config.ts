import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: Vercel serves the files in out/. Response headers (CSP,
  // framing, HSTS) live in vercel.json because export ignores headers().
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
  // Don't ship source to browsers, or advertise the framework.
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        // Only our own CSS: rewriting `as: "*.css"` would strip CSS-module
        // semantics from node_modules (e.g. react-tweet's *.module.css).
        condition: { not: "foreign" },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
