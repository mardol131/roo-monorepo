import { MOCK_FAVOURITE_LISTINGS } from "@/app/_mock/mock";

export async function fetchFavouriteListings() {
  const res = MOCK_FAVOURITE_LISTINGS();
  if (!res) throw new Error("Failed to fetch favourite listings");
  return res;
}
