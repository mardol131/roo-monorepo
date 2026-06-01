import {
  GetCollectionParams,
  PatchData,
  patchCollectionItem,
  getCollection,
} from "@/app/functions/api/general";
import { UserMedia } from "@roo/common";

export async function fetchUserMedias(options?: GetCollectionParams) {
  const res = await getCollection({
    collection: "user-media",
    query: options?.query,
    limit: options?.limit,
    page: options?.page,
    sort: options?.sort,
    searchParams: options?.searchParams,
    headers: options?.headers,
  });
  if (!res) throw new Error("Failed to fetch user medias");
  return res;
}

export async function updateUserMedia(id: string, data: PatchData<UserMedia>) {
  const res = await patchCollectionItem({ collection: "user-media", id, data });
  if (!res) throw new Error("Failed to update user media");
  return res;
}
