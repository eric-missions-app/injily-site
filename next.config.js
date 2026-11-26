/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Allow-list every external image host here before next/image uses it.
    remotePatterns: [],
  },
};

module.exports = nextConfig;
