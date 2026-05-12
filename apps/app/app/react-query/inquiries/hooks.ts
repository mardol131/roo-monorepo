import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { getIdFromRelationshipField, Inquiry, Listing } from "@roo/common";
import { PatchData } from "@/app/functions/api/general";
import { companyKeys, inquiryKeys, listingKeys } from "../query-keys";
import {
  createInquiry,
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

export type UpdateInquiryVars = { id: string; data: PatchData<Inquiry> };

export function useUpdateInquiry({
  listingId,
  options,
}: {
  listingId: string;
  options?: UseMutationOptions<Inquiry, Error, UpdateInquiryVars>;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateInquiryVars) => updateInquiry(id, data),
    onSuccess: (data, variables, context, mutation) => {
      // Invaliduje detail listingu i seznam na dashboardu
      queryClient.invalidateQueries({ queryKey: inquiryKeys.byId(data.id) });
      queryClient.invalidateQueries({
        queryKey: inquiryKeys.byListing(listingId),
      });
      options?.onSuccess?.(data, variables, context, mutation);
    },
    onError: (...args) => {
      options?.onError?.(...args);
    },
  });
}

export function useCreateInquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Inquiry, "id" | "createdAt" | "updatedAt">) =>
      createInquiry(data),
    onSuccess: (newInquiry) => {
      const listingId = getIdFromRelationshipField(newInquiry?.doc?.listing);
      if (listingId) {
        queryClient.invalidateQueries({
          queryKey: inquiryKeys.byListing(listingId),
        });
      }
    },
  });
}
