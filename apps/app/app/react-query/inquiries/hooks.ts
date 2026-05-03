import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Inquiry, Listing } from "@roo/common";
import { companyKeys, inquiryKeys, listingKeys } from "../query-keys";
import {
  fetchInquiries,
  fetchInquiriesByListing,
  fetchInquiry,
  updateInquiry,
} from "./fetch";

export function useInquiriesByListing(listingId: string) {
  return useQuery({
    queryKey: inquiryKeys.byListing(listingId),
    queryFn: () => fetchInquiriesByListing(listingId),
    enabled: !!listingId,
  });
}

export function useInquiries() {
  return useQuery({
    queryKey: inquiryKeys.all(),
    queryFn: () => fetchInquiries(),
  });
}

export function useInquiry(id: string | undefined) {
  return useQuery({
    queryKey: inquiryKeys.byId(id ?? ""),
    queryFn: () => fetchInquiry(id!),
    enabled: !!id,
  });
}

export function useUpdateInquiry(id: string, listingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Inquiry>) => updateInquiry(id, data),
    onSuccess: () => {
      // Invaliduje detail listingu i seznam na dashboardu
      queryClient.invalidateQueries({ queryKey: inquiryKeys.byId(id) });
      queryClient.invalidateQueries({
        queryKey: inquiryKeys.byListing(listingId),
      });
    },
  });
}
