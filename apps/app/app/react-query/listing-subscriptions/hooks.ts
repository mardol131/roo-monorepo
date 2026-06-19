import { useQuery } from "@tanstack/react-query";
import { listingSubscriptionKeys } from "../query-keys";
import {
  fetchListingSubscription,
  fetchListingSubscriptionsByCompany,
  fetchListingSubscriptionsByListing,
} from "./fetch";
import { GetCollectionParams } from "@/app/functions/api/general";
import { fetchPaymentHistory } from "@/app/functions/api/stripe";

export function useListingSubscription(id: string | undefined) {
  return useQuery({
    queryKey: listingSubscriptionKeys.byId(id ?? ""),
    queryFn: () => fetchListingSubscription(id!),
    enabled: !!id,
  });
}

export function useListingSubscriptionsByListing(listingId: string | undefined) {
  return useQuery({
    queryKey: listingSubscriptionKeys.byListing(listingId ?? ""),
    queryFn: () => fetchListingSubscriptionsByListing(listingId!),
    enabled: !!listingId,
  });
}

export function useListingSubscriptionsByCompany(
  companyId: string | undefined,
  options?: GetCollectionParams,
) {
  return useQuery({
    queryKey: listingSubscriptionKeys.byCompany(companyId ?? ""),
    queryFn: () => fetchListingSubscriptionsByCompany(companyId!, options),
    enabled: !!companyId,
  });
}

export function usePaymentHistory(subscriptionId: string | undefined) {
  return useQuery({
    queryKey: listingSubscriptionKeys.paymentHistory(subscriptionId ?? ""),
    queryFn: () => fetchPaymentHistory(subscriptionId!),
    enabled: !!subscriptionId,
  });
}
