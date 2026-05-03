import { getCollection } from "@/app/functions/api/general";

export async function fetchChatMessagesByInquiry(inquiryId: string) {
  const res = await getCollection({
    collection: "chat-messages",
    query: { inquiryId: { equals: inquiryId } },
    sort: "createdAt",
  });
  if (!res) throw new Error("Failed to fetch messages");
  return res;
}
