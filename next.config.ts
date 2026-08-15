import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["sharp"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
