import { Where } from "@roo/common";

// Entities

export const listingKeys = {
  all: () => ["listings"] as const,
  byId: (id: string) => ["listings", id] as const,
  byCompany: (companyId: string) => ["listings", "company", companyId] as const,
};

export const companyKeys = {
  all: () => ["companies"] as const,
  byId: (id: string) => ["companies", id] as const,
};

export const inquiryKeys = {
  all: () => ["inquiries"] as const,
  byId: (id: string) => ["inquiries", id] as const,
  byListing: (listingId: string) =>
    ["inquiries", "listing", listingId] as const,
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
  all: () => ["events"] as const,
  byId: (id: string) => ["events", id] as const,
};

export const favouriteListingKeys = {
  all: () => ["favouriteListings"] as const,
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
  all: (query?: Where, limit?: number) =>
    ["dish-types", query, limit] as const,
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
  all: (query?: Where, limit?: number) =>
    ["personnel", query, limit] as const,
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

export const rulesKeys = {
  all: (query?: Where, limit?: number) => ["rules", query, limit] as const,
};
