import { getCollection, postCollectionItem } from "@/app/functions/api/general";
import { ChatMessage } from "@roo/common";

export async function fetchChatMessagesByInquiry(inquiryId: string) {
  const res = await getCollection({
    collection: "chat-messages",
    query: { inquiry: { equals: inquiryId } },
    sort: "createdAt",
  });
  if (!res) throw new Error("Failed to fetch messages");
  return res;
}

export type CreateChatMessagePayload = Omit<
  ChatMessage,
  "id" | "createdAt" | "updatedAt"
>;

export async function createChatMessage(payload: CreateChatMessagePayload) {
  const res = await postCollectionItem({
    collection: "chat-messages",
    data: payload,
  });
  if (!res) throw new Error("Failed to create message");
  return res;
}
