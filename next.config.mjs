/** @type {import('next').NextConfig} */

// Repo is a *project* page (mohsensafari83.github.io/opencv-learning-log),
// not a user/org root page (mohsensafari83.github.io) — so every asset URL
// needs the "/opencv-learning-log" prefix, or CSS/JS/images 404 once deployed.
// If you ever rename the repo to exactly "mohsensafari83.github.io", delete
// basePath/assetPrefix entirely — a root user page is served from "/".
const REPO_NAME = "opencv-learning-log";

const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  reactStrictMode: true,
  output: "export", // static HTML/CSS/JS only — required for GitHub Pages (no Node server there)
  basePath: isProd ? `/${REPO_NAME}` : "",
  assetPrefix: isProd ? `/${REPO_NAME}/` : "",
  images: {
    unoptimized: true, // next/image's optimizer needs a server; not used here anyway (plain <img> tags)
  },
  trailingSlash: true, // GitHub Pages serves /modules/module-1/ as a folder+index.html, not a route
};

export default nextConfig;
