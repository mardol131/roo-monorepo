import { Where } from "@roo/common";

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

export const regionsKeys = {
  all: (query?: Where, limit?: number) => ["regions", query, limit] as const,
};

export const districtsKeys = {
  all: (query?: Where, limit?: number) => ["districts", query, limit] as const,
};

export const citiesKeys = {
  all: (query?: Where, limit?: number) => ["cities", query, limit] as const,
};
