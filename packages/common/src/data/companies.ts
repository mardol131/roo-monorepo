/**
 * Role členů firmy. Vlastník firmy (owner) je nad těmito rolemi a má vždy plný přístup.
 *
 * editor  — vytváření a úpravy inzerátů a poptávek; bez mazání, bez aktivace v katalogu
 * manager — vše výše + mazání a aktivace inzerátů v katalogu; nemůže upravovat firmu samotnou
 */
export type CompanyMemberRoles = "editor" | "manager";

export function getCompanyMemberRole(roles: CompanyMemberRoles[]) {
  return roles;
}
