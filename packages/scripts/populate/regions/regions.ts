import { config } from "../config";

const CUZK_URL = "https://ags.cuzk.cz/arcgis/rest/services/RUIAN/MapServer/17/query";

type CuzkRegion = { kod: number; nazev: string };

async function fetchRegionsFromCuzk(): Promise<CuzkRegion[]> {
  const params = new URLSearchParams({
    where: "platido IS NULL",
    outFields: "kod,nazev",
    returnGeometry: "false",
    f: "json",
  });
  const res = await fetch(`${CUZK_URL}?${params}`);
  if (!res.ok) throw new Error(`ČÚZK request failed: ${res.status}`);
  const data = await res.json() as { features?: { attributes: CuzkRegion }[] };
  if (!data.features?.length) throw new Error("No features returned — check layer ID");
  return data.features.map((f) => f.attributes);
}

async function login(): Promise<string> {
  const res = await fetch(`${config.backendUrl}/api/admins/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: config.email, password: config.password }),
  });
  if (!res.ok) throw new Error(`Login failed: ${res.status} ${await res.text()}`);
  return ((await res.json()) as { token: string }).token;
}

async function upsertRegion(
  token: string,
  region: { name: string; code: string; country: string },
): Promise<"created" | "updated"> {
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
  console.log("Fetching regions from ČÚZK...");
  const rows = await fetchRegionsFromCuzk();
  console.log(`Found ${rows.length} regions.\n`);

  console.log(`Logging in as ${config.email}...`);
  const token = await login();
  console.log(`Upserting ${rows.length} regions...\n`);

  let created = 0, updated = 0;
  const failures: { name: string; error: string }[] = [];

  for (const row of rows) {
    try {
      const action = await upsertRegion(token, {
        name: row.nazev,
        code: String(row.kod),
        country: "cz",
      });
      action === "created" ? created++ : updated++;
      console.log(`  ${action === "created" ? "✓" : "↺"} ${row.nazev} [${action}]`);
    } catch (err) {
      failures.push({ name: row.nazev, error: String(err) });
      console.log(`  ✗ ${row.nazev} [failed]`);
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
