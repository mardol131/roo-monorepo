import type { NextConfig } from "next";
import path from "path/win32";
import dotenv from "dotenv";

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
    return [
      {
        source: "/",
        destination: "/homepage",
      },
      {
        source: "/katalog/:type",
        destination: "/catalog/:type",
      },
      {
        source: "/katalog",
        destination: "/catalog",
      },
      {
        source: "/inzerat/:id",
        destination: "/listing/:id",
      },
    ];
  },
};

export default nextConfig;
