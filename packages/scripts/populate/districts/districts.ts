import { PayloadResponse, Region } from "@roo/common";
import { config } from "../config";

const CUZK_URL = "https://ags.cuzk.cz/arcgis/rest/services/RUIAN/MapServer/15/query";
const PAGE_SIZE = 500;

type CuzkDistrict = {
  kod: number;
  nazev: string;
  vusc: number;
  geometry: { rings: number[][][] };
};

type BboxPayload = {
  bboxMinLon: number;
  bboxMinLat: number;
  bboxMaxLon: number;
  bboxMaxLat: number;
};

type DistrictPayload = {
  name: string;
  code: string;
  region: string;
  country: string;
} & BboxPayload;

async function fetchDistrictsFromCuzk(): Promise<CuzkDistrict[]> {
  const districts: CuzkDistrict[] = [];
  let offset = 0;

  while (true) {
    const params = new URLSearchParams({
      where: "platido IS NULL",
      outFields: "kod,nazev,vusc",
      returnGeometry: "true",
      outSR: "4326",
      resultOffset: String(offset),
      resultRecordCount: String(PAGE_SIZE),
      f: "json",
    });
    const res = await fetch(`${CUZK_URL}?${params}`);
    if (!res.ok) throw new Error(`ČÚZK request failed: ${res.status}`);
    const data = await res.json() as {
      features?: { attributes: Omit<CuzkDistrict, "geometry">; geometry: CuzkDistrict["geometry"] }[];
      exceededTransferLimit?: boolean;
    };

    if (!data.features?.length) break;
    districts.push(...data.features.map((f) => ({ ...f.attributes, geometry: f.geometry })));

    if (!data.exceededTransferLimit) break;
    offset += PAGE_SIZE;
    process.stdout.write(`\r  Fetching from ČÚZK: ${districts.length} districts...`);
  }

  console.log(`\r  Fetched ${districts.length} districts from ČÚZK.     `);
  return districts;
}

function calcGeodata(rings: number[][][]): BboxPayload {
  let minLon = Infinity, maxLon = -Infinity;
  let minLat = Infinity, maxLat = -Infinity;

  for (const ring of rings) {
    for (const [lon, lat] of ring) {
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }
  }

  return { bboxMinLon: minLon, bboxMinLat: minLat, bboxMaxLon: maxLon, bboxMaxLat: maxLat };
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

type RegionEntry = {
  id: string;
  bbox: BboxPayload;
};

async function fetchRegions(token: string): Promise<{
  byCode: Map<string, RegionEntry>;
  byName: Map<string, RegionEntry>;
}> {
  const docs: (Region & { code: string; name: string } & BboxPayload)[] = [];
  let page = 1;
  while (true) {
    const res = await fetch(`${config.backendUrl}/api/regions?limit=100&page=${page}`, {
      headers: { Authorization: `JWT ${token}` },
    });
    if (!res.ok) throw new Error(`Failed to fetch regions: ${res.status}`);
    const data = (await res.json()) as PayloadResponse<Region & { code: string; name: string } & BboxPayload>;
    if (data.docs) docs.push(...data.docs);
    if (page >= data.totalPages) break;
    page++;
  }

  const toEntry = (r: (typeof docs)[number]): RegionEntry => ({
    id: r.id,
    bbox: {
      bboxMinLon: r.bboxMinLon,
      bboxMinLat: r.bboxMinLat,
      bboxMaxLon: r.bboxMaxLon,
      bboxMaxLat: r.bboxMaxLat,
    },
  });

  return {
    byCode: new Map(docs.map((r) => [r.code, toEntry(r)])),
    byName: new Map(docs.map((r) => [r.name, toEntry(r)])),
  };
}

async function upsertDistrict(
  token: string,
  district: DistrictPayload,
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

  console.log(`Logging in as ${config.email}...`);
  const token = await login();

  console.log("Fetching regions from Payload...");
  const regionMap = await fetchRegions(token);
  console.log(`Found ${regionMap.byCode.size} regions.\n`);

  let created = 0, updated = 0, skipped = 0;
  const failures: { name: string; error: string }[] = [];

  for (const row of rows) {
    const entry = regionMap.byCode.get(String(row.vusc));
    if (!entry) {
      console.log(`  ⚠ ${row.nazev} — no region for vusc=${row.vusc} [skipped]`);
      skipped++;
      continue;
    }
    try {
      const action = await upsertDistrict(token, {
        name: row.nazev,
        code: String(row.kod),
        region: entry.id,
        country: "cz",
        ...calcGeodata(row.geometry.rings),
      });
      action === "created" ? created++ : updated++;
      console.log(`  ${action === "created" ? "✓" : "↺"} ${row.nazev} [${action}]`);
    } catch (err) {
      failures.push({ name: row.nazev, error: String(err) });
      console.log(`  ✗ ${row.nazev} [failed]`);
    }
  }

  const prahaEntry = regionMap.byName.get("Hlavní město Praha");
  if (prahaEntry) {
    try {
      const action = await upsertDistrict(token, {
        name: "Hlavní město Praha",
        code: "Praha",
        region: prahaEntry.id,
        country: "cz",
        ...prahaEntry.bbox,
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
