type StorageSchema = {
  // add keys and their value types here
  favouriteListings: string[]; // example key for storing favourite listing IDs
};

type StorageKey = keyof StorageSchema;

function isServer() {
  return typeof window === "undefined";
}

function read<K extends StorageKey>(key: K): StorageSchema[K] | null {
  if (isServer()) return null;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as StorageSchema[K];
  } catch {
    return null;
  }
}

function write<K extends StorageKey>(key: K, value: StorageSchema[K]): void {
  if (isServer()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

function remove(key: StorageKey): void {
  if (isServer()) return;
  localStorage.removeItem(key);
}

export const storage = { read, write, remove };
