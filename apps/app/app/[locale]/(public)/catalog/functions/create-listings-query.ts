import { CatalogType } from "@/app/data/catalog";
import { Where } from "@roo/common";
import { Bbox } from "@/app/components/ui/atoms/inputs/map-point-input";
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

export function createListingsQuery({
  catalogType,
  params,
  viewportBbox,
}: {
  catalogType: CatalogType;
  params: URLSearchParams;
  viewportBbox?: Bbox;
}): Where {
  const and: Where[] = [];
  const general = generalFiltersFromParams(params);

  and.push({ status: { equals: "active" } });
  and.push({ "details.blockType": { equals: catalogType } });

  const totalCapacity = general.adults + general.children;
  if (totalCapacity > 1) {
    and.push({ "details.capacity": { greater_than_equal: totalCapacity } });
  }

  const common = commonFiltersFromParams(params);

  pushPrice(and, common.minPrice, common.maxPrice);
  if (common.eventTypes.length > 0)
    and.push({ eventTypes: { in: common.eventTypes } });

  if (catalogType === "venue") {
    const f = venueFiltersFromParams(params);

    if (general.city) {
      and.push({ "details.location.city": { equals: general.city } });
    }

    if (f.placeTypes.length > 0)
      and.push({ "details.placeTypes": { in: f.placeTypes } });
    if (f.amenities.length > 0)
      and.push({ "details.amenities": { in: f.amenities } });

    if (viewportBbox) {
      const [west, south, east, north] = viewportBbox;
      and.push({ "details.location.latitude": { greater_than_equal: south } });
      and.push({ "details.location.latitude": { less_than_equal: north } });
      and.push({ "details.location.longitude": { greater_than_equal: west } });
      and.push({ "details.location.longitude": { less_than_equal: east } });
    }
  } else if (catalogType === "gastro") {
    const f = gastroFiltersFromParams(params);

    if (f.cuisines.length > 0)
      and.push({ "details.cuisines": { in: f.cuisines } });
    if (f.dishTypes.length > 0)
      and.push({ "details.dishTypes": { in: f.dishTypes } });
    if (f.dietaryOptions.length > 0)
      and.push({ "details.dietaryOptions": { in: f.dietaryOptions } });
    if (f.foodServiceStyles.length > 0)
      and.push({ "details.foodServiceStyles": { in: f.foodServiceStyles } });
  } else {
    const f = entertainmentFiltersFromParams(params);

    if (f.activities.length > 0)
      and.push({ "details.activities": { in: f.activities } });
  }

  return { and };
}
