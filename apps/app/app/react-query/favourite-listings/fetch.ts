import { getCollection } from "@/app/functions/api/general";

export async function fetchFavouriteListings() {
  const res = await getCollection({
    collection: "favourite-listings",
    sort: "-createdAt",
  });
  if (!res) throw new Error("Failed to fetch favourite listings");
  return res;
}
