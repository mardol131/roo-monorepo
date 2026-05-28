import { Company, getIdFromRelationshipField } from "@roo/common";

/**
 * Vrací true, pokud má uživatel přístup k inquiry z firemní strany.
 * Přístup mají owner, admin a manager — editor poptávky nevidí.
 */
export function hasInquiryUpdateCompanyRights({
  company,
  userId,
}: {
  company?: Company;
  userId?: string;
}): boolean {
  if (!userId || !company) return false;

  const ownerId = getIdFromRelationshipField(company.owner);
  if (ownerId === userId) return true;

  return (
    company.members?.some((member) => {
      const memberId = getIdFromRelationshipField(member.user);
      return (
        memberId === userId &&
        (member.role === "admin" || member.role === "manager")
      );
    }) ?? false
  );
}
