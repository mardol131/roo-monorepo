import { PayloadResponse } from "@roo/common";
import { config } from "../config";

const CUZK_URL = "https://ags.cuzk.cz/arcgis/rest/services/RUIAN/MapServer/12/query";
const BATCH_SIZE = 10;
const PAGE_SIZE = 1000;

type CuzkCity = {
  kod: number;
  nazev: string;
  okres: number;
  geometry: { rings: number[][][] };
};

type CityPayload = {
  name: string;
  code: string;
  district: string;
  country: string;
  latitude: number;
  longitude: number;
  bboxMinLon: number;
  bboxMinLat: number;
  bboxMaxLon: number;
  bboxMaxLat: number;
};

async function fetchCitiesFromCuzk(): Promise<CuzkCity[]> {
  const cities: CuzkCity[] = [];
  let offset = 0;

  while (true) {
    const params = new URLSearchParams({
      where: "platido IS NULL",
      outFields: "kod,nazev,okres",
      returnGeometry: "true",
      outSR: "4326",
      resultOffset: String(offset),
      resultRecordCount: String(PAGE_SIZE),
      f: "json",
    });

    const res = await fetch(`${CUZK_URL}?${params}`);
    if (!res.ok) throw new Error(`ČÚZK request failed: ${res.status}`);
    const data = await res.json() as {
      features?: { attributes: Omit<CuzkCity, "geometry">; geometry: CuzkCity["geometry"] }[];
      exceededTransferLimit?: boolean;
    };

    if (!data.features?.length) break;
    cities.push(...data.features.map((f) => ({ ...f.attributes, geometry: f.geometry })));

    if (!data.exceededTransferLimit) break;
    offset += PAGE_SIZE;
    process.stdout.write(`\r  Fetching from ČÚZK: ${cities.length} municipalities...`);
  }

  console.log(`\r  Fetched ${cities.length} municipalities from ČÚZK.     `);
  return cities;
}

function calcGeodata(rings: number[][][]) {
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

  return {
    longitude: (minLon + maxLon) / 2,
    latitude: (minLat + maxLat) / 2,
    bboxMinLon: minLon,
    bboxMinLat: minLat,
    bboxMaxLon: maxLon,
    bboxMaxLat: maxLat,
  };
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

type DistrictMaps = {
  byCode: Map<string, string>;
  byName: Map<string, string>;
};

async function fetchDistrictMap(token: string): Promise<DistrictMaps> {
  const districts: { id: string; code: string; name: string }[] = [];
  let page = 1;
  while (true) {
    const res = await fetch(`${config.backendUrl}/api/districts?limit=500&page=${page}`, {
      headers: { Authorization: `JWT ${token}` },
    });
    if (!res.ok) throw new Error(`Failed to fetch districts: ${res.status}`);
    const data = (await res.json()) as PayloadResponse<{ id: string; code: string; name: string }>;
    if (data.docs) districts.push(...data.docs);
    if (page >= data.totalPages) break;
    page++;
  }
  return {
    byCode: new Map(districts.map((d) => [d.code, d.id])),
    byName: new Map(districts.map((d) => [d.name.toLowerCase(), d.id])),
  };
}

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
  console.log("Fetching municipalities from ČÚZK...");
  const rows = await fetchCitiesFromCuzk();

  console.log(`Logging in as ${config.email}...`);
  const token = await login();

  console.log("Fetching districts from Payload...");
  const districtMap = await fetchDistrictMap(token);
  console.log(`Found ${districtMap.byCode.size} districts.\n`);

  let created = 0, updated = 0, skippedNoDistrict = 0;
  const failures: { name: string; error: string }[] = [];
  const skipped: { name: string; kod: number; okres: number }[] = [];

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map((row) => {
        const districtId =
          districtMap.byCode.get(String(row.okres)) ??
          (row.okres === null ? districtMap.byName.get("hlavní město praha") : undefined);
        if (!districtId) {
          skippedNoDistrict++;
          skipped.push({ name: row.nazev, kod: row.kod, okres: row.okres });
          return Promise.resolve("skipped" as const);
        }
        return upsertCity(token, {
          name: row.nazev,
          code: String(row.kod),
          district: districtId,
          country: "cz",
          ...calcGeodata(row.geometry.rings),
        });
      }),
    );

    for (let j = 0; j < results.length; j++) {
      const result = results[j];
      if (result.status === "fulfilled") {
        if (result.value === "created") created++;
        else if (result.value === "updated") updated++;
      } else {
        failures.push({
          name: batch[j].nazev,
          error: result.reason?.message ?? String(result.reason),
        });
      }
    }

    const progress = Math.min(i + BATCH_SIZE, rows.length);
    process.stdout.write(
      `\r  ${progress}/${rows.length} — ✓ ${created} created  ↺ ${updated} updated  ✗ ${failures.length} failed`,
    );
  }

  console.log(`\n\n─────────────────────────────────────`);
  console.log(`  ✓ created  : ${created}`);
  console.log(`  ↺ updated  : ${updated}`);
  console.log(`  ⚠ skipped  : ${skippedNoDistrict} (no matching district)`);
  console.log(`  ✗ failed   : ${failures.length}`);
  if (skipped.length > 0) {
    console.log(`\nSkipped (no matching district):`);
    skipped.forEach((s) => console.log(`  • ${s.name} (kod=${s.kod}, okres=${s.okres})`));
  }
  if (failures.length > 0) {
    console.log(`\nFailed records:`);
    failures.slice(0, 20).forEach((f) => console.log(`  • ${f.name}: ${f.error}`));
    if (failures.length > 20) console.log(`  ... and ${failures.length - 20} more`);
  }
  console.log(`─────────────────────────────────────`);

  if (failures.length > 0) process.exit(1);
}

main().catch((err) => { console.error(err); process.exit(1); });
