import { Where } from "@roo/common";

// Entities

export const listingKeys = {
  all: (query?: Where, limit?: number) => ["listings", query, limit] as const,
  byId: (id: string) => ["listings", id] as const,
  byCompany: (companyId: string, query?: Where, limit?: number) =>
    ["listings", "company", companyId, query, limit] as const,
};

export const listingDetailKeys = {
  byId: (collection: string, id: string) =>
    ["listing-detail", collection, id] as const,
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
  byListing: (listingId: string) => ["variants", "listing", listingId] as const,
  byId: (id: string) => ["variants", id] as const,
};

export const spaceKeys = {
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
  all: (query?: Where, limit?: number) => ["events", query, limit] as const,
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
};

// Locality

export const regionsKeys = {
  all: (query?: Where, limit?: number) => ["regions", query, limit] as const,
};

export const districtsKeys = {
  all: (query?: Where, limit?: number) => ["districts", query, limit] as const,
};

export const citiesKeys = {
  all: (query?: Where, limit?: number) => ["cities", query, limit] as const,
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
