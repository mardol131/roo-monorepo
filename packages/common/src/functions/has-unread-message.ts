import { Inquiry } from "../types/inquiry";

export function hasUnreadMessageForUser(inquiry: Inquiry): boolean {
  if (!inquiry.lastCompanyMessageSentAt) return false;
  if (!inquiry.lastUserSeenAt) return true;
  return inquiry.lastCompanyMessageSentAt > inquiry.lastUserSeenAt;
}
