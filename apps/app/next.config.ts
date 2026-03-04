import type { NextConfig } from "next";
import path from "path/win32";
import dotenv from "dotenv";
import createNextIntlPlugin from "next-intl/plugin";

if (process.env.VERCEL !== "1") {
  const rootEnvPath = path.resolve(__dirname, "../.env");
  dotenv.config({ path: rootEnvPath });
  console.log("🔹 ENV načteno z rootu");
} else {
  console.warn("⚠️ Root .env nebyl nalezen");
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  typedRoutes: false,
};

const withNextIntl = createNextIntlPlugin("./app/i18n/request.ts");

export default withNextIntl(nextConfig);
