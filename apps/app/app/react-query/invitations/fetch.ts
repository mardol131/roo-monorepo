import {
  getCollection,
  patchCollectionItem,
} from "@/app/functions/api/general";
import { Company, Invitation, PayloadResponse } from "@roo/common";
import { UpdateCompanyPayload } from "../companies/fetch";

export async function fetchPendingInvitationsByCompany(
  companyId: string,
): Promise<PayloadResponse<Invitation>> {
  const res = await getCollection({
    collection: "invitations",
    sort: "-createdAt",
    query: {
      company: { equals: companyId },
      status: { equals: "pending" },
    },
  });
  if (!res) throw new Error("Failed to fetch invitations");
  return res;
}

export type UpdateInvitationPayload = Partial<Invitation>;

export async function updateInvitation(
  id: string,
  data: UpdateInvitationPayload,
): Promise<Invitation> {
  const res = await patchCollectionItem({
    collection: "invitations",
    id,
    data,
  });
  if (!res) throw new Error("Failed to update invitation");
  return res;
}
