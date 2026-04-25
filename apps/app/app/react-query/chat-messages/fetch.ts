import { COMPANIES, getMessages } from "@/app/_mock/mock";
import { Company } from "@roo/common";

export async function fetchChatMessagesByInquiry(inquiryId: string) {
  const res = getMessages(inquiryId);
  if (!res) throw new Error("Failed to fetch messages");
  return res;
}
