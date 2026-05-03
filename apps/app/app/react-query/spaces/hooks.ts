import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { spaceKeys } from "../query-keys";
import { createSpace, CreateSpaceInput, fetchSpace, fetchSpacesByListing, updateSpace } from "./fetch";

export function useSpacesByListing(listingId: string) {
  return useQuery({
    queryKey: spaceKeys.byListing(listingId),
    queryFn: () => fetchSpacesByListing(listingId),
    enabled: !!listingId,
  });
}

export function useSpace(id: string) {
  return useQuery({
    queryKey: spaceKeys.byId(id),
    queryFn: () => fetchSpace(id),
    enabled: !!id,
  });
}

export function useCreateSpace(listingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSpaceInput) => createSpace(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: spaceKeys.byListing(listingId) });
    },
  });
}

export function useUpdateSpace(id: string, listingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CreateSpaceInput>) => updateSpace(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: spaceKeys.byId(id) });
      queryClient.invalidateQueries({ queryKey: spaceKeys.byListing(listingId) });
    },
  });
}
