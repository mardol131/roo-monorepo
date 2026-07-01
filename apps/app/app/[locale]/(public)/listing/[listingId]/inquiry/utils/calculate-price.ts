import type {
  ListingEntertainmentDetail,
  ListingGastroDetail,
  ListingVenueDetail,
  Event,
  City,
  District,
} from "@roo/common";
import type { SelectedAddon, SelectedSpace, ServiceTime } from "@/app/store/order-store";

type AnyDetail = ListingVenueDetail | ListingGastroDetail | ListingEntertainmentDetail;
type PricingUnit = "per_day" | "per_person" | "per_hour" | "lump_sum";

export type PriceBreakdown = {
  base: number;
  spaces: number;
  addons: number;
  accommodation: number;
  breakfast: number;
  parking: number;
  catering: number;
  total: number;
  travelFeeEstimate: number;
};

export function durationMinutesFromServiceTime(serviceTime?: ServiceTime | null): number | undefined {
  if (!serviceTime?.startTime || !serviceTime.endTime) return undefined;
  const diff = new Date(serviceTime.endTime).getTime() - new Date(serviceTime.startTime).getTime();
  const minutes = Math.round(diff / 60000);
  return minutes > 0 ? minutes : undefined;
}

export function pricingFactor(
  unit: PricingUnit,
  days: number,
  adults: number,
  durationMinutes?: number,
): number {
  switch (unit) {
    case "per_day":
      return days;
    case "per_person":
      return adults;
    case "per_hour":
      return durationMinutes ? durationMinutes / 60 : 1;
    case "lump_sum":
      return 1;
  }
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getEventLocationPoint(eventData: Event): [number, number] | null {
  if (!eventData?.location) return null;
  const city = eventData.location.city;
  if (city && typeof city !== "string" && (city as City).latitude) {
    const c = city as City;
    return [c.longitude, c.latitude];
  }
  const district = eventData.location.district;
  if (district && typeof district !== "string") {
    const d = district as District;
    return [
      (d.bboxMinLon + d.bboxMaxLon) / 2,
      (d.bboxMinLat + d.bboxMaxLat) / 2,
    ];
  }
  return null;
}

export function calculateEstimatedPrice({
  detail,
  eventData,
  selectedAddons,
  selectedSpaces,
  accommodation,
  breakfast,
  parking,
  wantsCatering,
  serviceTime,
  listingLocation,
}: {
  detail: AnyDetail | undefined;
  eventData: Event | undefined;
  selectedAddons: SelectedAddon[];
  selectedSpaces: SelectedSpace[];
  accommodation: { guests: number } | null;
  breakfast: { guests: number } | null;
  parking: { spots: number } | null;
  wantsCatering: boolean;
  serviceTime?: ServiceTime | null;
  listingLocation?: [number, number];
}): PriceBreakdown {
  const startMs = eventData?.date?.start ? new Date(eventData.date.start).getTime() : 0;
  const endMs = eventData?.date?.end ? new Date(eventData.date.end).getTime() : startMs;
  const days = Math.max(1, Math.ceil((endMs - startMs) / 86_400_000));
  const adults = eventData?.guests?.adults ?? 1;
  const durationMinutes = durationMinutesFromServiceTime(serviceTime);

  const base = detail?.price?.base
    ? detail.price.base * pricingFactor(detail.price.pricingUnit, days, adults, durationMinutes)
    : 0;

  const spaces = selectedSpaces.reduce(
    (sum, s) => sum + s.price * days,
    0,
  );

  const addons = selectedAddons.reduce(
    (sum, a) => sum + a.unitPrice * a.quantity * pricingFactor(a.pricingUnit, days, adults, durationMinutes),
    0,
  );

  let accommodationTotal = 0;
  void accommodation;

  let breakfastTotal = 0;
  if (breakfast && detail && "breakfast" in detail) {
    const bfDetail = (detail as ListingVenueDetail).breakfast;
    if (!bfDetail.breakfastIsIncludedInPrice && bfDetail.price) {
      breakfastTotal = bfDetail.price * breakfast.guests * days;
    }
  }

  let parkingTotal = 0;
  if (parking && detail && "parking" in detail) {
    const pkDetail = (detail as ListingVenueDetail).parking;
    if (!pkDetail.parkingIsIncludedInPrice && pkDetail.parkingPrice) {
      parkingTotal = pkDetail.parkingPrice * parking.spots * days;
    }
  }

  let cateringTotal = 0;
  if (wantsCatering && detail && "catering" in detail) {
    const ct = (detail as ListingVenueDetail).catering;
    if (ct?.hasCatering && ct.price) {
      cateringTotal = ct.price * pricingFactor(ct.pricingUnit ?? "lump_sum", days, adults, durationMinutes);
    }
  }

  const total = base + spaces + addons + accommodationTotal + breakfastTotal + parkingTotal + cateringTotal;

  // Travel fee estimate — not included in total
  let travelFeeEstimate = 0;
  if (detail?.price?.travelFeeEnabled && listingLocation && eventData) {
    const eventPoint = getEventLocationPoint(eventData);
    if (eventPoint) {
      const distKm = haversineKm(
        eventPoint[1], eventPoint[0],
        listingLocation[1], listingLocation[0],
      );
      const startsAt = detail?.price?.travelFeeStartsAtKm ?? 0;
      const billableKm = Math.max(0, distKm - startsAt);
      const perKm = detail?.price?.travelFeePerKm ?? 0;
      const multiplier = detail?.price?.travelFeeType === "round_trip" ? 2 : 1;
      travelFeeEstimate = billableKm * perKm * multiplier;
    }
  }

  return {
    base,
    spaces,
    addons,
    accommodation: accommodationTotal,
    breakfast: breakfastTotal,
    parking: parkingTotal,
    catering: cateringTotal,
    total,
    travelFeeEstimate,
  };
}
