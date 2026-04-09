import { Inquiry } from "../types/payload-types";

export function aggregateInquiryStatus({
  userStatus,
  companyStatus,
}: Pick<Inquiry, "userStatus" | "companyStatus">): Inquiry["userStatus"] {
  if (userStatus === "pending" || companyStatus === "pending") {
    return "pending";
  } else if (userStatus === "confirmed" && companyStatus === "confirmed") {
    return "confirmed";
  } else if (userStatus === "cancelled" || companyStatus === "cancelled") {
    return "cancelled";
  } else {
    return "pending";
  }
}

export function hasUnreadMessageForUser(inquiry: Inquiry): boolean {
  if (!inquiry.lastCompanyMessageSentAt) return false;
  if (!inquiry.lastUserSeenAt) return true;
  return inquiry.lastCompanyMessageSentAt > inquiry.lastUserSeenAt;
}

export const formatInquiryCountLabel = (count: number) => {
  if (count === 1) return "1 poptávka";
  if (count > 1 && count < 5) return `${count} poptávky`;
  return `${count} poptávek`;
};
