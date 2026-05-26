import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { roadmapItemsKeys } from "../query-keys";
import { fetchRoadmapItems, voteForRoadmapItem } from "./fetch";

export function useRoadmapItems() {
  return useQuery({
    queryKey: roadmapItemsKeys.all(),
    queryFn: () => fetchRoadmapItems(),
  });
}

export function useVoteForRoadmapItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => voteForRoadmapItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: roadmapItemsKeys.all(),
      });
    },
  });
}
