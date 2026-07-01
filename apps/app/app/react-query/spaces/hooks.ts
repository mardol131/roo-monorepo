import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { GetCollectionParams } from "@/app/functions/api/general";
import { listingKeys, spaceKeys } from "../query-keys";
import {
  createSpace,
  CreateSpaceInput,
  deleteSpace,
  fetchSpace,
  fetchSpaces,
  fetchSpacesByListing,
  updateSpace,
} from "./fetch";
import { Space } from "@roo/common";

export function useSpaces(options?: GetCollectionParams, enabled = true) {
  return useQuery({
    queryKey: spaceKeys.all(options?.query, options?.limit),
    queryFn: () => fetchSpaces(options),
    enabled,
  });
}

export function useSpacesByListing(listingId: string) {
  return useQuery({
    queryKey: spaceKeys.byListing(listingId),
    queryFn: () => fetchSpacesByListing(listingId),
    enabled: !!listingId,
  });
}

export function useSpace(id: string | undefined) {
  return useQuery({
    queryKey: spaceKeys.byId(id ?? ""),
    queryFn: () => fetchSpace(id!),
    enabled: !!id,
  });
}

export function useCreateSpace(listingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSpaceInput) => createSpace(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: spaceKeys.byListing(listingId),
      });
      queryClient.invalidateQueries({ queryKey: listingKeys.byId(listingId) });
    },
  });
}

export function useUpdateSpace(id: string, listingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Space>) => updateSpace(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: spaceKeys.byId(id) });
      queryClient.invalidateQueries({
        queryKey: spaceKeys.byListing(listingId),
      });
      queryClient.invalidateQueries({ queryKey: listingKeys.byId(listingId) });
    },
  });
}

export type UseDeleteSpaceOptions = {
  id: string;
  listingId: string;
};

export function useDeleteSpace(
  id: string,
  listingId: string,
  options?: UseMutationOptions<{ success: boolean }, Error, void>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteSpace(id),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: spaceKeys.byListing(listingId),
      });
      options?.onSuccess?.(...args);
    },
  });
}
