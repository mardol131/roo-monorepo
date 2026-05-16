export const RECORD_STATUSES = [
  "active",
  "inactive",
  "disabled",
  "archived",
  "unavailable",
  "completed",
] as const;

export type RecordStatus = (typeof RECORD_STATUSES)[number];

// active   — viditelný a funkční, zobrazuje se v katalogu
// inactive — neaktivní, není viditelný pro veřejnost
// disabled — systém ho vypnul automaticky (např. změna spacesType na listingu)
// archived — uživatel ho soft-smazal, data zůstávají v DB
// unavailable — systém ho vypnul automaticky, protože se na něj odkazuje neexistující entita (např. listing, který odkazuje na neexistující firmu)
// completed   — například event, který byl již uskutečněn

export function getRecordStatuses(include?: RecordStatus[]): RecordStatus[] {
  if (!include) return [...RECORD_STATUSES];
  return RECORD_STATUSES.filter((s) => include.includes(s));
}
