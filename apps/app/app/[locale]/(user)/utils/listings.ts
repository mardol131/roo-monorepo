import {
  Company,
  CompanyMemberRoles,
  getIdFromRelationshipField,
} from "@roo/common";

/**
 * Role, které lze předat do hasListingRights.
 * 'owner' je pozice nad member rolemi — má vždy plný přístup.
 */
export type ListingRoleCheck = CompanyMemberRoles | "owner";

/**
 * Vrací true, pokud userId odpovídá některé z allowedRoles v kontextu dané firmy.
 *
 * Použití:
 *   hasListingRights(company, userId, ["owner", "admin", "manager"])  → může tvořit / mazat
 *   hasListingRights(company, userId, ["owner", "admin", "manager", "editor"])  → může editovat
 *   hasListingRights(company, userId, ["owner", "admin"])  → může editovat firmu samotnou
 *   hasListingRights(company, userId, ["editor"])  → je to konkrétně editor (schovej tlačítko)
 */
export function hasListingRights({
  allowedRoles,
  company,
  userId,
}: {
  allowedRoles: ListingRoleCheck[];
  company?: Company;
  userId?: string;
}): boolean {
  if (!userId || !company) return false;

  if (allowedRoles.includes("owner")) {
    const ownerId = getIdFromRelationshipField(company.owner);
    if (ownerId === userId) return true;
  }

  const memberRoles = allowedRoles.filter(
    (r): r is CompanyMemberRoles => r !== "owner",
  );

  if (!memberRoles.length) return false;

  return (
    company.members?.some((member) => {
      const memberId = getIdFromRelationshipField(member.user);
      return (
        memberId === userId &&
        memberRoles.includes(member.role as CompanyMemberRoles)
      );
    }) ?? false
  );
}
