import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: isDev ? undefined : "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: isDev ? "" : "/Ecommerce",
  assetPrefix: isDev ? "" : "/Ecommerce/",
  pageExtensions: ['tsx', 'ts']
};

export default nextConfig;
