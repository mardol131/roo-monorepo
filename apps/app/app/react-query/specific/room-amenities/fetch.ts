import { getCollection } from "@/app/functions/api/general";
import { RoomAmenity, PayloadResponse, Where } from "@roo/common";

export type FetchRoomAmenitiesOptions = {
  query?: Where;
  limit?: number;
  sortBy?: string;
};

export async function fetchRoomAmenities(
  options?: FetchRoomAmenitiesOptions,
): Promise<PayloadResponse<RoomAmenity>> {
  const { query, limit = 100, sortBy = "name" } = options || {};
  const res = await getCollection({
    collection: "room-amenities",
    query,
    limit,
    sort: sortBy,
  });

  if (!res) throw new Error("Failed to fetch room-amenities");
  return res;
}
