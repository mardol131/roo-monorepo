import { Config, LocalityType, Where } from "@roo/common";
import {
  GetCollectionCountOptions,
  GetCollectionParams,
} from "../functions/api/general";

// Global
export const globalKeys = {
  count: (options: GetCollectionCountOptions<keyof Config["collections"]>) =>
    ["global", "count", options] as const,
};

// Entities

export const listingKeys = {
  all: (options?: GetCollectionParams) => ["listings", options] as const,
  byId: (id: string) => ["listings", id] as const,
  byCompany: (companyId: string, query?: Where, limit?: number) =>
    ["listings", "company", companyId, query, limit] as const,
  pinsByLocation: (locationId: string, type: LocalityType) =>
    ["listings", "pins", locationId, type] as const,
  availability: (ids: string[], from: string, to: string) =>
    ["listings", "availability", ids, from, to] as const,
  geoSearch: (params: Record<string, unknown>) =>
    ["listings", "geo-search", params] as const,
};

export const listingDetailKeys = {
  byId: (collection: string, id: string) =>
    ["listing-detail", collection, id] as const,
};

export const listingSubscriptionKeys = {
  byId: (id: string) => ["listing-subscriptions", id] as const,
  byListing: (listingId: string) =>
    ["listing-subscriptions", "listing", listingId] as const,
  byCompany: (companyId: string) =>
    ["listing-subscriptions", "company", companyId] as const,
  paymentHistory: (subscriptionId: string) =>
    ["listing-subscriptions", "payment-history", subscriptionId] as const,
};

export const invitationKeys = {
  byCompany: (companyId?: string) =>
    companyId
      ? (["invitations", "company", companyId] as const)
      : (["invitations", "company"] as const),
};

export const companyKeys = {
  root: () => ["companies"] as const,
  all: (query?: Where, limit?: number) => ["companies", query, limit] as const,
  byId: (id: string) => ["companies", id] as const,
};

export const inquiryKeys = {
  all: (query?: Where, limit?: number) => ["inquiries", query, limit] as const,
  byId: (id: string) => ["inquiries", id] as const,
  byListing: (listingId: string) =>
    ["inquiries", "listing", listingId] as const,
  byEvent: (eventId: string) => ["inquiries", "event", eventId] as const,
  acceptedByEvent: (eventId: string) =>
    ["inquiries", "event", eventId, "accepted"] as const,
};

export const variantKeys = {
  all: (query?: Where, limit?: number) => ["variants", query, limit] as const,
  byListing: (listingId: string) => ["variants", "listing", listingId] as const,
  byId: (id: string) => ["variants", id] as const,
};

export const spaceKeys = {
  all: (query?: Where, limit?: number) => ["spaces", query, limit] as const,
  byListing: (listingId: string) => ["spaces", "listing", listingId] as const,
  byId: (id: string) => ["spaces", id] as const,
};

export const calendarEventKeys = {
  byListing: (listingId: string) =>
    ["calendarEvents", "listing", listingId] as const,
  byId: (id: string) => ["calendarEvents", id] as const,
};

export const chatMessageKeys = {
  byInquiry: (inquiryId: string) =>
    ["chatMessages", "inquiry", inquiryId] as const,
  byId: (id: string) => ["chatMessages", id] as const,
};

export const eventKeys = {
  all: (options?: GetCollectionParams) => ["events", options] as const,
  byId: (id: string) => ["events", id] as const,
};

export const favouriteListingKeys = {
  all: () => ["favouriteListings"] as const,
};

export const roadmapItemsKeys = {
  all: () => ["roadmapItems"] as const,
};

export const userNotificationKeys = {
  all: () => ["userNotifications"] as const,
  unreadCount: () => ["userNotificationsUnreadCount"] as const,
};

// Locality

export const regionsKeys = {
  all: (options?: GetCollectionParams) => ["regions", options] as const,
};

export const districtsKeys = {
  all: (options?: GetCollectionParams) => ["districts", options] as const,
};

export const citiesKeys = {
  all: (options?: GetCollectionParams) => ["cities", options] as const,
  byId: (id: string) => ["cities", id] as const,
};

// Filters

export const activitiesKeys = {
  all: (query?: Where, limit?: number) => ["activities", query, limit] as const,
};

export const amenitiesKeys = {
  all: (query?: Where, limit?: number) => ["amenities", query, limit] as const,
};

export const cuisinesKeys = {
  all: (query?: Where, limit?: number) => ["cuisines", query, limit] as const,
};

export const dietaryOptionsKeys = {
  all: (query?: Where, limit?: number) =>
    ["dietary-options", query, limit] as const,
};

export const dishTypesKeys = {
  all: (query?: Where, limit?: number) => ["dish-types", query, limit] as const,
};

export const entertainmentTypesKeys = {
  all: (query?: Where, limit?: number) =>
    ["entertainment-types", query, limit] as const,
};

export const eventTypesKeys = {
  all: (query?: Where, limit?: number) =>
    ["event-types", query, limit] as const,
};

export const foodServiceStylesKeys = {
  all: (query?: Where, limit?: number) =>
    ["food-service-styles", query, limit] as const,
};

export const personnelKeys = {
  all: (query?: Where, limit?: number) => ["personnel", query, limit] as const,
};

export const placeTypesKeys = {
  all: (query?: Where, limit?: number) =>
    ["place-types", query, limit] as const,
};

export const servicesKeys = {
  all: (query?: Where, limit?: number) => ["services", query, limit] as const,
};

export const technologiesKeys = {
  all: (query?: Where, limit?: number) =>
    ["technologies", query, limit] as const,
};

// Specific

export const necessitiesKeys = {
  all: (query?: Where, limit?: number) =>
    ["necessities", query, limit] as const,
};

export const roomAmenitiesKeys = {
  all: (query?: Where, limit?: number) =>
    ["room-amenities", query, limit] as const,
};

export const spaceTypesKeys = {
  all: (query?: Where, limit?: number) =>
    ["space-types", query, limit] as const,
};

export const rulesKeys = {
  all: (query?: Where, limit?: number) => ["rules", query, limit] as const,
};

export const filterOptionsKeys = {
  all: () => ["filter-options"] as const,
};

export const userMediasKeys = {
  all: (params?: GetCollectionParams) => ["user-medias", params] as const,
  infinite: (limit: number) => ["user-medias", "infinite", limit] as const,
};
