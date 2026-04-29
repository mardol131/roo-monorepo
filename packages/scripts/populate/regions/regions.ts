import fs from "fs";
import path from "path";

import { Region } from "@roo/common";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001";
const EMAIL = process.env.SEED_EMAIL ?? "dolezalmartin131@gmail.com";
const PASSWORD = process.env.SEED_PASSWORD ?? "stefka131";
const CSV_PATH = path.join(import.meta.dirname, "kraje.csv");

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function parseDate(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const [day, month, yearTime] = trimmed.split(".");
  const year = yearTime.trim().split(" ")[0];
  return new Date(`${year}-${month}-${day}`).toISOString();
}

function parseCSV(content: string) {
  const lines = content.trim().split("\n").slice(1); // skip header
  return lines
    .filter((l) => l.trim())
    .map((line) => {
      const [kod, nazev, regsoudrKod, nutsCode, platiOd, platiDo, datumVzniku] =
        line.split(";");
      return {
        kod: Number(kod.trim()),
        name: nazev.trim(),
        regsoudrKod: Number(regsoudrKod.trim()),
        nutsCode: nutsCode.trim(),
        platiOd: parseDate(platiOd),
        platiDo: parseDate(platiDo),
        datumVzniku: parseDate(datumVzniku),
      };
    });
}

async function login(): Promise<string> {
  console.log(`Logging in as ${EMAIL}... with password ${PASSWORD}`);
  const res = await fetch(`${BACKEND_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok)
    throw new Error(`Login failed: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { token: string };
  return data.token;
}

type RegionPayload = Omit<Region, "id" | "createdAt" | "updatedAt">;

async function createRegion(token: string, region: RegionPayload) {
  const res = await fetch(`${BACKEND_URL}/api/regions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(region),
  });
  if (!res.ok)
    throw new Error(
      `Failed to create "${region.name}": ${res.status} ${await res.text()}`,
    );
  return res.json();
}

async function main() {
  const csv = fs.readFileSync(CSV_PATH, "utf-8");
  const rows = parseCSV(csv);

  console.log(`Logging in as ${EMAIL}...`);
  const token = await login();

  console.log(`Creating ${rows.length} regions...`);
  for (const row of rows) {
    const region: RegionPayload = {
      name: row.name,
      slug: slugify(row.name),
      code: row.kod,
    };
    await createRegion(token, region);
    console.log(`  ✓ ${region.name} (${region.code})`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
