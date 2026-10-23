import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const backend = (
  process.env.MYCELIUM_BACKEND_URL ||
  "http://localhost:8080"
).replace(/\/api\/v1\/?$|\/$/g, "");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backend}/api/v1/:path*`,
      },
    ];
  },
};

export default createNextIntlPlugin()(nextConfig);
