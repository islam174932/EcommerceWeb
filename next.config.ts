import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages
  ...(isProduction && isGitHubPages && {
    output: 'export',
    trailingSlash: true,
    basePath: '/Ecommerce',
    assetPrefix: '/Ecommerce/',
  }),
  
  // Image optimization settings
  images: {
    unoptimized: isProduction && isGitHubPages,
  },

  // Development settings
  ...(!isProduction && {
    reactStrictMode: true,
  })
};

export default nextConfig;
