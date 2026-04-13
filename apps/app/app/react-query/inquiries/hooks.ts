import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Listing } from "@roo/common";
import { companyKeys, inquiryKeys, listingKeys } from "../query-keys";
import { fetchInquiriesByListing, fetchInquiry, updateInquiry } from "./fetch";

export function useInquiriesByListing(listingId: string) {
  return useQuery({
    queryKey: inquiryKeys.byListing(listingId),
    queryFn: () => fetchInquiriesByListing(listingId),
    enabled: !!listingId,
  });
}

export function useInquiry(id: string | undefined) {
  return useQuery({
    queryKey: inquiryKeys.byId(id ?? ""),
    queryFn: () => fetchInquiry(id!),
    enabled: !!id,
  });
}

export function useUpdateListing(id: string, listingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Listing>) => updateInquiry(id, data),
    onSuccess: () => {
      // Invaliduje detail listingu i seznam na dashboardu
      queryClient.invalidateQueries({ queryKey: inquiryKeys.byId(id) });
      queryClient.invalidateQueries({
        queryKey: inquiryKeys.byListing(listingId),
      });
    },
  });
}
