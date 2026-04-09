export function getIdFromRelationshipField(
  record: string | { id: string; [key: string]: any },
): string {
  if (typeof record === "string") {
    return record;
  }
  return record.id;
}
