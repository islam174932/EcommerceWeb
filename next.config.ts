import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Only apply GitHub Pages settings in production build with GitHub Actions
  ...(isProduction && isGitHubPages && {
    output: 'export',
    trailingSlash: true,
    basePath: '/EcommerceWeb',
    assetPrefix: '/EcommerceWeb/',
  }),
  
  // Image optimization settings
  images: {
    unoptimized: isProduction && isGitHubPages,
  }
};

export default nextConfig;
