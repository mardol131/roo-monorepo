import { useQuery } from "@tanstack/react-query";
import { favouriteListingKeys } from "../query-keys";
import { fetchFavouriteListings } from "./fetch";

export function useFavouriteListings() {
  return useQuery({
    queryKey: favouriteListingKeys.all(),
    queryFn: async () => await fetchFavouriteListings(),
  });
}
