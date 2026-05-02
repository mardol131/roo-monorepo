import fs from "fs";
import path from "path";
import { config } from "../config";

const CSV_PATH = path.join(import.meta.dirname, "filters.csv");

const COLLECTIONS = [
  "activities",
  "amenities",
  "cuisines",
  "dietary-options",
  "dish-types",
  "entertainment-types",
  "event-types",
  "food-service-styles",
  "personnel",
  "place-types",
  "services",
  "technologies",
] as const;

type Collection = (typeof COLLECTIONS)[number];

type Row = { collection: Collection; name: string; slug: string };

function parseCSV(content: string): Row[] {
  return content
    .trim()
    .split("\n")
    .slice(1)
    .filter((l) => l.trim())
    .map((line) => {
      const [collection, name, slug] = line.split(";").map((s) => s.trim());
      return { collection: collection as Collection, name, slug };
    });
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

async function upsert(
  token: string,
  collection: Collection,
  item: { name: string; slug: string },
): Promise<"created" | "updated"> {
  const headers = { "Content-Type": "application/json", Authorization: `JWT ${token}` };

  const existing = (await fetch(
    `${config.backendUrl}/api/${collection}?where[slug][equals]=${item.slug}&limit=1`,
    { headers },
  ).then((r) => r.json())) as { docs: { id: string }[] };

  if (existing.docs.length > 0) {
    const res = await fetch(`${config.backendUrl}/api/${collection}/${existing.docs[0].id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    return "updated";
  }

  const res = await fetch(`${config.backendUrl}/api/${collection}`, {
    method: "POST",
    headers,
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return "created";
}

async function main() {
  const rows = parseCSV(fs.readFileSync(CSV_PATH, "utf-8"));

  console.log(`Logging in as ${config.email}...`);
  const token = await login();

  const byCollection = COLLECTIONS.reduce(
    (acc, col) => ({ ...acc, [col]: rows.filter((r) => r.collection === col) }),
    {} as Record<Collection, Row[]>,
  );

  let totalCreated = 0;
  let totalUpdated = 0;
  const failures: { collection: string; name: string; error: string }[] = [];

  for (const collection of COLLECTIONS) {
    const items = byCollection[collection];
    if (items.length === 0) continue;

    console.log(`\n[${collection}] — ${items.length} položek`);
    let created = 0, updated = 0;

    for (const row of items) {
      try {
        const action = await upsert(token, collection, { name: row.name, slug: row.slug });
        action === "created" ? created++ : updated++;
        console.log(`  ${action === "created" ? "✓" : "↺"} ${row.name} [${action}]`);
      } catch (err) {
        failures.push({ collection, name: row.name, error: String(err) });
        console.log(`  ✗ ${row.name} [failed]`);
      }
    }

    totalCreated += created;
    totalUpdated += updated;
  }

  console.log(`\n─────────────────────────────────────`);
  console.log(`  ✓ created : ${totalCreated}`);
  console.log(`  ↺ updated : ${totalUpdated}`);
  console.log(`  ✗ failed  : ${failures.length}`);
  if (failures.length > 0) {
    console.log(`\nFailed records:`);
    failures.forEach((f) => console.log(`  • [${f.collection}] ${f.name}: ${f.error}`));
  }
  console.log(`─────────────────────────────────────`);

  if (failures.length > 0) process.exit(1);
}

main().catch((err) => { console.error(err); process.exit(1); });
