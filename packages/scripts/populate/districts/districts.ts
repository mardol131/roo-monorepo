import fs from "fs";
import path from "path";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001";
const EMAIL = process.env.SEED_EMAIL ?? "dolezalmartin131@gmail.com";
const PASSWORD = process.env.SEED_PASSWORD ?? "stefka131";
const CSV_PATH = path.join(import.meta.dirname, "okresy.csv");

function parseCSV(content: string) {
  const lines = content.trim().split("\n").slice(1);
  return lines
    .filter((l) => l.trim())
    .map((line) => {
      const [kod, nazev, vuscKod, nutsCode, , platiDo] = line.split(";");
      return {
        kod: Number(kod.trim()),
        name: nazev.trim(),
        vuscKod: Number(vuscKod.trim()),
        nutsCode: nutsCode.trim(),
        platiDo: platiDo.trim(),
      };
    })
    .filter((row) => !row.platiDo); // skip expired records
}

async function login(): Promise<string> {
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

async function fetchRegions(token: string): Promise<Map<number, string>> {
  const res = await fetch(`${BACKEND_URL}/api/regions?limit=100`, {
    headers: { Authorization: `JWT ${token}` },
  });
  if (!res.ok)
    throw new Error(`Failed to fetch regions: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { docs: { id: string; code: number }[] };
  return new Map(data.docs.map((r) => [r.code, r.id]));
}

type DistrictPayload = {
  name: string;
  slug: string;
  code: string;
  region: string;
};

async function createDistrict(token: string, district: DistrictPayload) {
  const res = await fetch(`${BACKEND_URL}/api/districts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(district),
  });
  if (!res.ok)
    throw new Error(
      `Failed to create "${district.name}": ${res.status} ${await res.text()}`,
    );
  return res.json();
}

async function main() {
  const csv = fs.readFileSync(CSV_PATH, "utf-8");
  const rows = parseCSV(csv);

  console.log(`Logging in as ${EMAIL}...`);
  const token = await login();

  console.log("Fetching regions...");
  const regionMap = await fetchRegions(token);
  console.log(`Found ${regionMap.size} regions.`);

  console.log(`Creating ${rows.length} districts...`);
  for (const row of rows) {
    const regionId = regionMap.get(row.vuscKod);
    if (!regionId) {
      console.warn(`  ⚠ No region found for VUSC_KOD=${row.vuscKod}, skipping "${row.name}"`);
      continue;
    }
    const district: DistrictPayload = {
      name: row.name,
      slug: row.nutsCode.toLowerCase(),
      code: row.nutsCode,
      region: regionId,
    };
    await createDistrict(token, district);
    console.log(`  ✓ ${district.name} (${district.code})`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
