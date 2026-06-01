import { GetCollectionParams } from "@/app/functions/api/general";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userMediasKeys } from "../query-keys";
import { updateUserMedia, fetchUserMedias } from "./fetch";

type UpdateUserMediaVars = { id: string; data: Parameters<typeof updateUserMedia>[1] };

export function useUsersMedia({
  options,
  allow,
}: { options?: GetCollectionParams; allow?: boolean } = {}) {
  return useQuery({
    queryKey: userMediasKeys.all(options),
    queryFn: () => fetchUserMedias(options),
    enabled: !!options && allow,
  });
}

export function useUsersMediaInfinite({
  limit = 20,
  enabled = true,
}: { limit?: number; enabled?: boolean } = {}) {
  return useInfiniteQuery({
    queryKey: userMediasKeys.infinite(limit),
    queryFn: ({ pageParam }) => fetchUserMedias({ limit, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    enabled,
  });
}

export function useUpdateUserMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: UpdateUserMediaVars) => updateUserMedia(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-medias"] });
    },
  });
}
