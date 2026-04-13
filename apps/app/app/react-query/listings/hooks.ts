import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Listing } from "@roo/common";
import { companyKeys, listingKeys } from "../query-keys";
import { fetchListing, fetchListingsByCompany, updateListing } from "./fetch";

export function useListingsByCompany(companyId: string) {
  return useQuery({
    queryKey: listingKeys.byCompany(companyId),
    queryFn: () => fetchListingsByCompany(companyId),
    enabled: !!companyId,
  });
}

export function useListing(id: string | undefined) {
  return useQuery({
    queryKey: listingKeys.byId(id ?? ""),
    queryFn: () => fetchListing(id!),
    enabled: !!id,
  });
}

export function useUpdateListing(id: string, companyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Listing>) => updateListing(id, data),
    onSuccess: () => {
      // Invaliduje detail listingu i seznam na dashboardu
      queryClient.invalidateQueries({ queryKey: listingKeys.byId(id) });
      queryClient.invalidateQueries({
        queryKey: listingKeys.byCompany(companyId),
      });
    },
  });
}
