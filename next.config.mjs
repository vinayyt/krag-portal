import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // These server-only packages use Node.js internals that webpack cannot bundle.
  // Telling Next.js to require() them at runtime instead of bundling them.
  serverExternalPackages: ["@anthropic-ai/sdk", "resend"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "kraggruppen.no" },
    ],
  },
};

export default withNextIntl(nextConfig);
