import { Region } from "@roo/common";
import fs from "fs";
import path from "path";
import { config } from "../config";

const CSV_PATH = path.join(import.meta.dirname, "kraje.csv");

function parseCSV(content: string) {
  return content
    .trim()
    .split("\n")
    .slice(1)
    .filter((l) => l.trim())
    .map((line) => {
      const [kod, nazev] = line.split(";");
      return { kod: kod.trim(), name: nazev.trim() };
    });
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

type RegionPayload = Omit<Region, "id" | "createdAt" | "updatedAt" | "slug">;

async function upsertRegion(token: string, region: RegionPayload): Promise<"created" | "updated"> {
  const headers = { "Content-Type": "application/json", Authorization: `JWT ${token}` };

  const existing = (await fetch(
    `${config.backendUrl}/api/regions?where[code][equals]=${region.code}&limit=1`,
    { headers },
  ).then((r) => r.json())) as { docs: { id: string }[] };

  if (existing.docs.length > 0) {
    const res = await fetch(`${config.backendUrl}/api/regions/${existing.docs[0].id}`, {
      method: "PATCH", headers, body: JSON.stringify(region),
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    return "updated";
  }

  const res = await fetch(`${config.backendUrl}/api/regions`, {
    method: "POST", headers, body: JSON.stringify(region),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return "created";
}

async function main() {
  const rows = parseCSV(fs.readFileSync(CSV_PATH, "utf-8"));

  console.log(`Logging in as ${config.email}...`);
  const token = await login();
  console.log(`Upserting ${rows.length} regions...\n`);

  let created = 0, updated = 0;
  const failures: { name: string; error: string }[] = [];

  for (const row of rows) {
    const region: RegionPayload = { name: row.name, code: row.kod, country: "cz" };
    try {
      const action = await upsertRegion(token, region);
      action === "created" ? created++ : updated++;
      console.log(`  ${action === "created" ? "✓" : "↺"} ${region.name} [${action}]`);
    } catch (err) {
      failures.push({ name: row.name, error: String(err) });
      console.log(`  ✗ ${region.name} [failed]`);
    }
  }

  console.log(`\n─────────────────────────────────────`);
  console.log(`  ✓ created : ${created}`);
  console.log(`  ↺ updated : ${updated}`);
  console.log(`  ✗ failed  : ${failures.length}`);
  if (failures.length > 0) {
    console.log(`\nFailed records:`);
    failures.forEach((f) => console.log(`  • ${f.name}: ${f.error}`));
  }
  console.log(`─────────────────────────────────────`);

  if (failures.length > 0) process.exit(1);
}

main().catch((err) => { console.error(err); process.exit(1); });
