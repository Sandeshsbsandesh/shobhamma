import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // API routes (Razorpay create-order / verify) need a Node host.
  // Do not use output: "export" while donations use order + signature verify.
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: { unoptimized: true },
};

export default nextConfig;
