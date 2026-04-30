import { District, PayloadResponse, Region } from "@roo/common";
import fs from "fs";
import path from "path";
import { config } from "../config";

const CSV_PATH = path.join(import.meta.dirname, "okresy.csv");

function parseCSV(content: string) {
  return content
    .trim()
    .split("\n")
    .slice(1)
    .filter((l) => l.trim())
    .map((line) => {
      const [kod, nazev, vuscKod, , , platiDo] = line.split(";");
      return { kod: kod.trim(), name: nazev.trim(), vuscKod: vuscKod.trim(), platiDo: platiDo.trim() };
    })
    .filter((row) => !row.platiDo);
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

async function fetchRegions(token: string): Promise<PayloadResponse<Region>> {
  const res = await fetch(`${config.backendUrl}/api/regions?limit=100`, {
    headers: { Authorization: `JWT ${token}`, "Content-Type": "application/json" },
  });
  if (!res.ok)
    throw new Error(`Failed to fetch regions: ${res.status} ${await res.text()}`);
  return res.json();
}

type DistrictPayload = Omit<District, "id" | "createdAt" | "updatedAt" | "slug">;

async function upsertDistrict(
  token: string,
  district: DistrictPayload & { code: string },
): Promise<"created" | "updated"> {
  const headers = { "Content-Type": "application/json", Authorization: `JWT ${token}` };

  const existing = (await fetch(
    `${config.backendUrl}/api/districts?where[code][equals]=${district.code}&limit=1`,
    { headers },
  ).then((r) => r.json())) as { docs: { id: string }[] };

  if (existing.docs.length > 0) {
    const res = await fetch(`${config.backendUrl}/api/districts/${existing.docs[0].id}`, {
      method: "PATCH", headers, body: JSON.stringify(district),
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    return "updated";
  }

  const res = await fetch(`${config.backendUrl}/api/districts`, {
    method: "POST", headers, body: JSON.stringify(district),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return "created";
}

async function main() {
  const rows = parseCSV(fs.readFileSync(CSV_PATH, "utf-8"));

  console.log(`Logging in as ${config.email}...`);
  const token = await login();

  console.log("Fetching regions...");
  const regionResponse = await fetchRegions(token);
  console.log(`Found ${regionResponse.docs.length} regions.\n`);
  console.log(`Upserting ${rows.length} districts...\n`);

  let created = 0, updated = 0, skipped = 0;
  const failures: { name: string; error: string }[] = [];

  for (const row of rows) {
    const regionId = regionResponse.docs.find((r) => r.code === row.vuscKod)?.id;
    if (!regionId) {
      console.log(`  ⚠ ${row.name} — no region for VUSC_KOD=${row.vuscKod} [skipped]`);
      skipped++;
      continue;
    }
    const district: DistrictPayload = { name: row.name, code: row.kod, region: regionId, country: "cz" };
    try {
      const action = await upsertDistrict(token, district);
      action === "created" ? created++ : updated++;
      console.log(`  ${action === "created" ? "✓" : "↺"} ${district.name} [${action}]`);
    } catch (err) {
      failures.push({ name: row.name, error: String(err) });
      console.log(`  ✗ ${row.name} [failed]`);
    }
  }

  console.log(`\n─────────────────────────────────────`);
  console.log(`  ✓ created : ${created}`);
  console.log(`  ↺ updated : ${updated}`);
  console.log(`  ⚠ skipped : ${skipped}`);
  console.log(`  ✗ failed  : ${failures.length}`);
  if (failures.length > 0) {
    console.log(`\nFailed records:`);
    failures.forEach((f) => console.log(`  • ${f.name}: ${f.error}`));
  }
  console.log(`─────────────────────────────────────`);

  if (failures.length > 0) process.exit(1);
}

main().catch((err) => { console.error(err); process.exit(1); });
