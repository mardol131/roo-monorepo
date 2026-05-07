import { PayloadResponse, Region } from "@roo/common";
import { config } from "../config";

const CUZK_URL = "https://ags.cuzk.cz/arcgis/rest/services/RUIAN/MapServer/15/query";

type CuzkDistrict = { kod: number; nazev: string; vusc: number };

async function fetchDistrictsFromCuzk(): Promise<CuzkDistrict[]> {
  const params = new URLSearchParams({
    where: "platido IS NULL",
    outFields: "kod,nazev,vusc",
    returnGeometry: "false",
    f: "json",
  });
  const res = await fetch(`${CUZK_URL}?${params}`);
  if (!res.ok) throw new Error(`ČÚZK request failed: ${res.status}`);
  const data = await res.json() as { features?: { attributes: CuzkDistrict }[] };
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

async function fetchRegions(token: string): Promise<{ byCode: Map<string, string>; byName: Map<string, string> }> {
  const res = await fetch(`${config.backendUrl}/api/regions?limit=100`, {
    headers: { Authorization: `JWT ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch regions: ${res.status}`);
  const data = (await res.json()) as PayloadResponse<Region & { code: string; name: string }>;
  return {
    byCode: new Map((data.docs ?? []).map((r) => [r.code, r.id])),
    byName: new Map((data.docs ?? []).map((r) => [r.name, r.id])),
  };
}

async function upsertDistrict(
  token: string,
  district: { name: string; code: string; region: string; country: string },
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
  console.log("Fetching districts from ČÚZK...");
  const rows = await fetchDistrictsFromCuzk();
  console.log(`Found ${rows.length} districts.\n`);

  console.log(`Logging in as ${config.email}...`);
  const token = await login();

  console.log("Fetching regions from Payload...");
  const regionMap = await fetchRegions(token);
  console.log(`Found ${regionMap.byCode.size} regions.\n`);

  let created = 0, updated = 0, skipped = 0;
  const failures: { name: string; error: string }[] = [];

  for (const row of rows) {
    const regionId = regionMap.byCode.get(String(row.vusc));
    if (!regionId) {
      console.log(`  ⚠ ${row.nazev} — no region for vusc=${row.vusc} [skipped]`);
      skipped++;
      continue;
    }
    try {
      const action = await upsertDistrict(token, {
        name: row.nazev,
        code: String(row.kod),
        region: regionId,
        country: "cz",
      });
      action === "created" ? created++ : updated++;
      console.log(`  ${action === "created" ? "✓" : "↺"} ${row.nazev} [${action}]`);
    } catch (err) {
      failures.push({ name: row.nazev, error: String(err) });
      console.log(`  ✗ ${row.nazev} [failed]`);
    }
  }

  const prahaRegionId = regionMap.byName.get("Hlavní město Praha");
  if (prahaRegionId) {
    try {
      const action = await upsertDistrict(token, {
        name: "Hlavní město Praha",
        code: "Praha",
        region: prahaRegionId,
        country: "cz",
      });
      action === "created" ? created++ : updated++;
      console.log(`  ${action === "created" ? "✓" : "↺"} Hlavní město Praha (synthetic) [${action}]`);
    } catch (err) {
      failures.push({ name: "Hlavní město Praha", error: String(err) });
      console.log(`  ✗ Hlavní město Praha [failed]`);
    }
  } else {
    console.log(`  ⚠ Region "Hlavní město Praha" not found — skipping synthetic district`);
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
