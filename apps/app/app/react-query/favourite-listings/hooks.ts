import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { favouriteListingKeys } from "../query-keys";
import {
  createFavouriteListing,
  CreateFavouriteListingPayload,
  deleteFavouriteListing,
  fetchFavouriteListings,
} from "./fetch";
import { FavouriteListing } from "@roo/common";
import { useAuth } from "@/app/context/auth/auth-context";

export function useFavouriteListings() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: favouriteListingKeys.all(),
    queryFn: async () => await fetchFavouriteListings(),
    enabled: isAuthenticated,
  });
}

export function useCreateFavouriteListing(
  options?: UseMutationOptions<
    FavouriteListing,
    Error,
    CreateFavouriteListingPayload
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFavouriteListingPayload) =>
      createFavouriteListing(data).then((res) => res.doc),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: favouriteListingKeys.all() });

      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      options?.onError?.(...args);
    },
  });
}

export function useDeleteFavouriteListing(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteFavouriteListing(id);
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: favouriteListingKeys.all() });

      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      options?.onError?.(...args);
    },
  });
}
