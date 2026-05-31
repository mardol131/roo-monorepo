import {
  getCollection,
  GetCollectionParams,
  patchCollection,
  patchCollectionItem,
  PatchData,
} from "@/app/functions/api/general";
import { UserNotification, Where } from "@roo/common";

export async function fetchUserNotifications(options?: GetCollectionParams) {
  const res = await getCollection({
    collection: "user-notifications",
    sort: "-createdAt",
    ...options,
    searchParams: new URLSearchParams({ depth: "0", ...Object.fromEntries(options?.searchParams ?? []) }),
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

export async function updateUserNotifications(
  query: Where,
  data: PatchData<UserNotification>,
) {
  const res = await patchCollection({
    collection: "user-notifications",
    query,
    data,
  });
  if (!res) throw new Error("Failed to update user notifications");
  return res;
}
