/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages uses static export or edge runtime
  output: "export",
  // Disable image optimization (Cloudflare handles it)
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
