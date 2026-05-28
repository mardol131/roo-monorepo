import {
  getCollection,
  patchCollectionItem,
  PatchData,
} from "@/app/functions/api/general";
import { UserNotification } from "@roo/common";

export async function fetchUserNotifications() {
  const res = await getCollection({
    collection: "user-notifications",
    searchParams: new URLSearchParams({ depth: "0", limit: "50", sort: "-createdAt" }),
  });
  if (!res) throw new Error("Failed to fetch user notifications");
  return res;
}

export async function updateUserNotification(
  id: string,
  data: PatchData<UserNotification>,
) {
  const res = await patchCollectionItem({
    collection: "user-notifications",
    id,
    data,
  });
  if (!res) throw new Error("Failed to update user notification");
  return res;
}
