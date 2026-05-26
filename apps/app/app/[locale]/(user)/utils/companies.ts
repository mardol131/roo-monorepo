import { Company, getIdFromRelationshipField } from "@roo/common";

/**
 * Vrací true, pokud má uživatel právo editovat firmu.
 * Shoduje se s backend access control pravidlem pro update.
 *
 * Podmínky: uživatel je owner NEBO člen s rolí 'admin'.
 */
export function canEditCompany(
  company: Company,
  userId: string | undefined,
): boolean {
  if (!userId) return false;

  const ownerId = getIdFromRelationshipField(company.owner);
  if (ownerId === userId) return true;

  return (
    company.members?.some((member) => {
      const memberId = getIdFromRelationshipField(member.user);
      return memberId === userId && member.role === "admin";
    }) ?? false
  );
}
