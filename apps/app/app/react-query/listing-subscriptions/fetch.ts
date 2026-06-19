import {
  getCollection,
  getCollectionItem,
  GetCollectionParams,
} from "@/app/functions/api/general";
import { ListingSubscription } from "@roo/common";

export async function fetchListingSubscriptionsByListing(listingId: string) {
  const res = await getCollection({
    collection: "listing-subscriptions",
    query: { listing: { equals: listingId } },
  });
  if (!res) throw new Error("Failed to fetch listing subscriptions");
  return res as { docs: ListingSubscription[]; totalDocs: number };
}

export async function fetchListingSubscriptionsByCompany(
  companyId: string,
  options?: GetCollectionParams,
) {
  const companyFilter = { company: { equals: companyId } };
  const mergedQuery = options?.query
    ? { and: [companyFilter, options.query] }
    : companyFilter;
  const res = await getCollection({
    collection: "listing-subscriptions",
    depth: 1,
    ...options,
    query: mergedQuery,
  });
  if (!res) throw new Error("Failed to fetch listing subscriptions");
  return res as { docs: ListingSubscription[]; totalDocs: number };
}

export async function fetchListingSubscription(id: string) {
  const res = await getCollectionItem({
    collection: "listing-subscriptions",
    id,
  });
  if (!res) throw new Error("Failed to fetch listing subscription");
  return res as ListingSubscription;
}
