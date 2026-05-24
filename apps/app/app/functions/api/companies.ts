import { MemberRole } from "@/app/components/ui/molecules/modals/add-team-member-modal";

export async function companyMemberVerify(companyMemberInviteToken: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companies/members/verify`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyMemberInviteToken }),
      credentials: "include",
    },
  );
  return res;
}

export async function companyMemberInvite(
  email: string,
  role: MemberRole,
  companyId: string,
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companies/members/invite`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role, companyId }),
      credentials: "include",
    },
  );
  return res;
}
