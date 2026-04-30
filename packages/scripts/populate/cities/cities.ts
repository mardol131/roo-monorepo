import { City, District, PayloadResponse } from "@roo/common";
import fs from "fs";
import path from "path";
import { config } from "../config";

const CSV_PATH = path.join(import.meta.dirname, "obce.csv");
const BATCH_SIZE = 10;

type ObecRow = { kod: string; name: string; okresKod: string };

function parseCSV(content: string): ObecRow[] {
  return content
    .trim()
    .split("\n")
    .slice(1)
    .filter((l) => l.trim())
    .map((line) => {
      const [kod, nazev, , , okresKod, , , , platiDo] = line.split(";");
      return { kod: kod.trim(), name: nazev.trim(), okresKod: okresKod.trim(), platiDo: platiDo.trim() };
    })
    .filter((r) => !r.platiDo);
}

async function login(): Promise<string> {
  const res = await fetch(`${config.backendUrl}/api/admins/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: config.email, password: config.password }),
  });
  if (!res.ok)
    throw new Error(`Login failed: ${res.status} ${await res.text()}`);
  return ((await res.json()) as { token: string }).token;
}

async function fetchDistricts(token: string): Promise<Map<string, string>> {
  const res = await fetch(`${config.backendUrl}/api/districts?limit=200`, {
    headers: { Authorization: `JWT ${token}` },
  });
  if (!res.ok)
    throw new Error(`Failed to fetch districts: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as PayloadResponse<District & { code: string }>;
  return new Map(data.docs.map((d) => [d.code, d.id]));
}

type CityPayload = Omit<City, "id" | "createdAt" | "updatedAt" | "slug"> & {
  country: string;
  code: string;
};

async function upsertCity(token: string, city: CityPayload): Promise<"created" | "updated"> {
  const headers = { "Content-Type": "application/json", Authorization: `JWT ${token}` };

  const existing = (await fetch(
    `${config.backendUrl}/api/cities?where[code][equals]=${city.code}&limit=1`,
    { headers },
  ).then((r) => r.json())) as { docs: { id: string }[] };

  if (existing.docs.length > 0) {
    const res = await fetch(`${config.backendUrl}/api/cities/${existing.docs[0].id}`, {
      method: "PATCH", headers, body: JSON.stringify(city),
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    return "updated";
  }

  const res = await fetch(`${config.backendUrl}/api/cities`, {
    method: "POST", headers, body: JSON.stringify(city),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return "created";
}

async function main() {
  const rows = parseCSV(fs.readFileSync(CSV_PATH, "utf-8"));

  console.log(`Logging in as ${config.email}...`);
  const token = await login();

  console.log("Fetching districts...");
  const districtMap = await fetchDistricts(token);
  console.log(`Found ${districtMap.size} districts.\n`);

  const cities: CityPayload[] = [];
  let skippedNoDistrict = 0;

  for (const row of rows) {
    const districtId = districtMap.get(row.okresKod);
    if (!districtId) {
      skippedNoDistrict++;
      continue;
    }
    cities.push({ name: row.name, code: row.kod, district: districtId, country: "cz" });
  }

  if (skippedNoDistrict > 0)
    console.log(`⚠ Skipped ${skippedNoDistrict} rows with unknown OKRES_KOD.\n`);

  console.log(`Upserting ${cities.length} cities in batches of ${BATCH_SIZE}...`);

  let created = 0, updated = 0;
  const failures: { name: string; error: string }[] = [];

  for (let i = 0; i < cities.length; i += BATCH_SIZE) {
    const batch = cities.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(batch.map((c) => upsertCity(token, c)));

    for (let j = 0; j < results.length; j++) {
      const result = results[j];
      if (result.status === "fulfilled") {
        result.value === "created" ? created++ : updated++;
      } else {
        failures.push({ name: batch[j].name, error: result.reason?.message ?? String(result.reason) });
      }
    }

    const progress = Math.min(i + BATCH_SIZE, cities.length);
    process.stdout.write(
      `\r  ${progress}/${cities.length} — ✓ ${created} created  ↺ ${updated} updated  ✗ ${failures.length} failed`,
    );
  }

  console.log(`\n\n─────────────────────────────────────`);
  console.log(`  ✓ created : ${created}`);
  console.log(`  ↺ updated : ${updated}`);
  console.log(`  ⚠ skipped : ${skippedNoDistrict}`);
  console.log(`  ✗ failed  : ${failures.length}`);
  if (failures.length > 0) {
    console.log(`\nFailed records:`);
    failures.forEach((f) => console.log(`  • ${f.name}: ${f.error}`));
  }
  console.log(`─────────────────────────────────────`);

  if (failures.length > 0) process.exit(1);
}

main().catch((err) => { console.error(err); process.exit(1); });
