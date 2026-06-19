import { CatalogType } from "@/app/data/catalog";
import { Where } from "@roo/common";
import {
  commonFiltersFromParams,
  entertainmentFiltersFromParams,
  gastroFiltersFromParams,
  generalFiltersFromParams,
  venueFiltersFromParams,
} from "../components/filters/filter-params";

function pushPrice(and: Where[], minPrice?: number, maxPrice?: number) {
  const min = minPrice ?? 0;
  const max = maxPrice ?? 100000;
  if (min > 0) and.push({ "price.startsAt": { greater_than_equal: min } });
  if (max < 100000) and.push({ "price.startsAt": { less_than_equal: max } });
}

function pushBbox(and: Where[], bbox: string[]) {
  if (bbox.length !== 4) return;
  const [west, south, east, north] = bbox.map(Number);
  if ([west, south, east, north].some(isNaN)) return;
  const polygon = {
    type: "Polygon",
    coordinates: [[
      [west, south], [east, south],
      [east, north], [west, north],
      [west, south],
    ]],
  };
  and.push({ "location.point": { within: polygon } });
}

// Venue has a single city relationship; district/region are resolved through that city doc.
function pushVenueLocation(
  and: Where[],
  city: string,
  district: string,
  region: string,
  bbox: string[],
) {
  if (city) {
    and.push({ "location.city": { equals: city } });
    return;
  }
  if (district) {
    and.push({ "location.city.district": { equals: district } });
    return;
  }
  if (region) {
    and.push({ "location.city.region": { equals: region } });
    return;
  }
  pushBbox(and, bbox);
}

export function createListingsQuery({
  catalogType,
  params,
  skipLocation = false,
}: {
  catalogType: CatalogType;
  params: URLSearchParams;
  skipLocation?: boolean;
}): Where {
  const and: Where[] = [];
  const general = generalFiltersFromParams(params);
  const common = commonFiltersFromParams(params);

  and.push({ status: { equals: "active" } });
  and.push({ subscriptionStatus: { equals: "paid" } });
  and.push({ type: { equals: catalogType } });

  const totalGuests = general.adults + general.children;
  if (totalGuests > 1)
    and.push({ "guests.max": { greater_than_equal: totalGuests } });
  if (general.accessibility) and.push({ "guests.ztp": { equals: true } });
  if (general.pets) and.push({ "guests.pets": { equals: true } });

  pushPrice(and, common.minPrice, common.maxPrice);

  if (common.eventTypes.length > 0)
    and.push({ "properties.eventTypes": { in: common.eventTypes } });

  if (!skipLocation && catalogType === "venue") {
    pushVenueLocation(
      and,
      general.city,
      general.district,
      general.region,
      general.bbox ?? [],
    );
  }

  if (catalogType === "venue") {
    const f = venueFiltersFromParams(params);

    if (f.placeTypes.length > 0)
      and.push({ "properties.placeTypes": { in: f.placeTypes } });
    if (f.amenities.length > 0)
      and.push({ "properties.amenities": { in: f.amenities } });
    if (f.activities.length > 0)
      and.push({ "properties.activities": { in: f.activities } });
  } else if (catalogType === "gastro") {
    const f = gastroFiltersFromParams(params);

    if (f.cuisines.length > 0)
      and.push({ "properties.cuisines": { in: f.cuisines } });
    if (f.dishTypes.length > 0)
      and.push({ "properties.dishTypes": { in: f.dishTypes } });
    if (f.dietaryOptions.length > 0)
      and.push({ "properties.dietaryOptions": { in: f.dietaryOptions } });
    if (f.foodServiceStyles.length > 0)
      and.push({ "properties.foodServiceStyles": { in: f.foodServiceStyles } });
  } else {
    const f = entertainmentFiltersFromParams(params);

    if (f.activities.length > 0)
      and.push({ "properties.activities": { in: f.activities } });
  }

  return { and };
}
