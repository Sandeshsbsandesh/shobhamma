import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // API routes (Razorpay create-order / verify) need a Node-compatible host.
  // Deploy with OpenNext on Cloudflare Workers (not static Pages `out/`).
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: { unoptimized: true },
};

export default nextConfig;

initOpenNextCloudflareForDev();
