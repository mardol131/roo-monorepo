import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  getIdFromRelationshipField,
  Inquiry,
} from "@roo/common";
import { GetCollectionParams, PatchData } from "@/app/functions/api/general";
import { inquiryKeys, listingKeys } from "../query-keys";
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

export function useInquiries({
  options,
  refetchInterval,
}: { options?: GetCollectionParams; refetchInterval?: number } = {}) {
  return useQuery({
    queryKey: inquiryKeys.all(options?.query, options?.limit),
    queryFn: () => fetchInquiries(options),
    refetchInterval,
  });
}

export function useInquiriesByEvent(
  eventId: string,
  opts?: GetCollectionParams & { refetchInterval?: number },
) {
  const { refetchInterval, ...collectionParams } = opts ?? {};
  return useQuery({
    queryKey: inquiryKeys.byEvent(eventId),
    queryFn: () =>
      fetchInquiries({
        ...collectionParams,
        query: collectionParams.query
          ? { and: [{ event: { equals: eventId } }, collectionParams.query] }
          : { event: { equals: eventId } },
      }),
    enabled: !!eventId,
    refetchInterval,
  });
}

export function useInquiry(
  id: string | undefined,
  options?: { refetchInterval?: number },
) {
  return useQuery({
    queryKey: inquiryKeys.byId(id ?? ""),
    queryFn: () => fetchInquiry(id!),
    enabled: !!id,
    refetchInterval: options?.refetchInterval,
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
