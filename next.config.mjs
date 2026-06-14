import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // These server-only packages use Node.js internals webpack cannot bundle.
    // Next.js 14 requires the experimental key; promoted to stable in Next.js 15.
    serverComponentsExternalPackages: ["@anthropic-ai/sdk", "resend"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "kraggruppen.no" },
    ],
  },
};

export default withNextIntl(nextConfig);
