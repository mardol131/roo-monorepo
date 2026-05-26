/**
 * Role členů firmy. Vlastník firmy (owner) je nad těmito rolemi a má vždy plný přístup.
 *
 * admin   — stejná práva jako owner; může editovat firmu, spravovat členy a vše s listingy
 * manager — správa listingů (vytváření, úpravy, mazání, aktivace); nemůže upravovat firmu ani členy
 * editor  — pouze úpravy existujících listingů; bez vytváření, mazání, aktivace a přístupu k firmě
 */
export type CompanyMemberRoles = "admin" | "manager" | "editor";

export function getCompanyMemberRole(roles: CompanyMemberRoles[]) {
  return roles;
}
