export const listingKeys = {
  all: (companyId: string) => ["listings", companyId] as const,
  byId: (id: string) => ["listings", id] as const,
  byCompany: (companyId: string) => ["listings", "company", companyId] as const,
};

export const companyKeys = {
  all: () => ["companies"] as const,
  byId: (id: string) => ["companies", id] as const,
};

export const inquiryKeys = {
  all: (listingId: string) => ["inquiries", listingId] as const,
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
