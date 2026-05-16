import {
  deleteCollectionItem,
  getCollection,
  postCollectionItem,
} from "@/app/functions/api/general";

export async function fetchFavouriteListings() {
  const res = await getCollection({
    collection: "favourite-listings",
    sort: "-createdAt",
  });
  if (!res) throw new Error("Failed to fetch favourite listings");
  return res;
}

export type CreateFavouriteListingPayload = {
  listing: string;
  user: string;
};

export async function createFavouriteListing(
  payload: CreateFavouriteListingPayload,
) {
  const res = await postCollectionItem({
    collection: "favourite-listings",
    data: payload,
  });
  if (!res) throw new Error("Failed to create favourite listing");
  return res;
}

export async function deleteFavouriteListing(id: string) {
  const res = await deleteCollectionItem({
    collection: "favourite-listings",
    id,
  });
  if (!res) throw new Error("Failed to delete favourite listing");
  return res;
}
