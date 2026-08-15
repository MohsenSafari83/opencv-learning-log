/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,

  // Vercel runs Next.js directly, so no GitHub Pages basePath/assetPrefix.
  output: "export",

  images: {
    unoptimized: true,
  },

  trailingSlash: true,
};

export default nextConfig;