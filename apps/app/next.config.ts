import type { NextConfig } from "next";
import path from "path/win32";
import dotenv from "dotenv";
import { rewrites } from "./config/rewrites";

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
  /* config options here */
  rewrites: async () => {
    return rewrites;
  },
};

export default nextConfig;
