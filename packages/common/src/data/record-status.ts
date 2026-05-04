export const RECORD_STATUSES = [
  "active",
  "inactive",
  "disabled",
  "archived",
] as const;

export type RecordStatus = (typeof RECORD_STATUSES)[number];

// active   — viditelný a funkční, zobrazuje se v katalogu
// inactive — neaktivní, není viditelný pro veřejnost
// disabled — systém ho vypnul automaticky (např. změna spacesType na listingu)
// archived — uživatel ho soft-smazal, data zůstávají v DB

export function getRecordStatuses(include?: RecordStatus[]): RecordStatus[] {
  if (!include) return [...RECORD_STATUSES];
  return RECORD_STATUSES.filter((s) => include.includes(s));
}
