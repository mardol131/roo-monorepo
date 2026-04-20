import { Space } from "@roo/common";
import { MOCK_SPACES } from "@/app/_mock/mock";

export async function fetchSpacesByListing(listingId: string) {
  const res = MOCK_SPACES.filter((space) => {
    if (typeof space.listing === "string") {
      return space.listing === listingId;
    }
    return space.listing.id === listingId;
  });
  if (!res) throw new Error("Failed to fetch spaces");
  return res;
}

export async function fetchSpace(id: string) {
  const res = MOCK_SPACES.find((space) => space.id === id);
  if (!res) throw new Error("Failed to fetch space");
  return res;
}

export type CreateSpaceInput = {
  name: string;
  type: Space["type"];
  listing: string;
  parent?: string;
  description?: string;
  capacity?: number;
  area?: number;
  images?: string[];
  hasAccommodation?: boolean;
  accommodationCapacity?: number;
  rooms?: { name: string; capacity: number; countOfRoomsOfThisType: number; amenityIds?: string[] }[];
  spaceRuleIds?: string[];
};

export async function createSpace(input: CreateSpaceInput): Promise<Space> {
  const newSpace: Space = {
    id: `sp-${Date.now()}`,
    name: input.name,
    type: input.type,
    listing: input.listing,
    parent: input.parent ?? null,
    description: input.description ?? null,
    capacity: input.capacity ?? null,
    area: input.area ?? null,
    images: input.images?.map((url) => ({ image: url })) ?? null,
    hasAccommodation: input.hasAccommodation ?? null,
    accommodationCapacity: input.accommodationCapacity ?? null,
    rooms:
      input.rooms?.map((r) => ({
        name: r.name,
        capacity: r.capacity,
        countOfRoomsOfThisType: r.countOfRoomsOfThisType,
        amenities: r.amenityIds ?? [],
      })) ?? null,
    spaceRules: input.spaceRuleIds ?? null,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  MOCK_SPACES.push(newSpace);
  return newSpace;
}
