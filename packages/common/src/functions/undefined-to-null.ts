export function undefinedToNull<T>(val: T): T {
  if (val === undefined) return null as T;
  if (Array.isArray(val)) return val.map(undefinedToNull) as T;
  if (val !== null && typeof val === "object") {
    return Object.fromEntries(
      Object.entries(val).map(([k, v]) => [k, undefinedToNull(v)]),
    ) as T;
  }
  return val;
}
