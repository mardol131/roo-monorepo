import { Inquiry } from "../types/payload-types";

export function aggregateInquiryStatus(
  status: Inquiry["status"],
): Inquiry["status"]["user"] {
  const { user: userStatus, company: companyStatus } = status;
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
  if (!inquiry.activity?.lastCompanyMessageSentAt) return false;
  if (!inquiry.activity?.lastUserSeenAt) return true;
  return (
    inquiry.activity.lastCompanyMessageSentAt > inquiry.activity.lastUserSeenAt
  );
}

export const formatInquiryCountLabel = (count: number) => {
  if (count === 1) return "1 poptávka";
  if (count > 1 && count < 5) return `${count} poptávky`;
  return `${count} poptávek`;
};
