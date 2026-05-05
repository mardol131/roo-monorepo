export function slugify(text: string, withCode: boolean): string {
  let slug = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (withCode) {
    const code = Math.random().toString(36).substring(2, 8);
    slug += `-${code}`;
  }

  return slug;
}
