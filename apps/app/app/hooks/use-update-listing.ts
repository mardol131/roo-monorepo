import {
  Listing,
  ListingEntertainmentDetail,
  ListingGastroDetail,
  ListingVenueDetail,
} from "@roo/common";
import {
  UpdateListingData,
  useUpdateListing,
  useUpdateListingDetail,
} from "@/app/react-query/listings/hooks";
type ToIds<T> = {
  [K in keyof T]?: T[K] extends (string | infer _)[] | null | undefined
    ? string[]
    : never;
};

type BaseListingUpdate = Omit<UpdateListingData, "filters" | "options">;

type GastroListingUpdate = BaseListingUpdate & {
  filters?: ToIds<ListingGastroDetail["filters"]>;
  options?: ToIds<ListingGastroDetail["options"]>;
};

type VenueListingUpdate = BaseListingUpdate & {
  filters?: ToIds<ListingVenueDetail["filters"]>;
  options?: ToIds<ListingVenueDetail["options"]>;
};

type EntertainmentListingUpdate = BaseListingUpdate & {
  filters?: ToIds<ListingEntertainmentDetail["filters"]>;
  options?: ToIds<ListingEntertainmentDetail["options"]>;
};

export function useUpdateGastroListing(companyId: string) {
  const { mutateAsync: updateListing } = useUpdateListing(companyId);
  const { mutateAsync: updateDetail } = useUpdateListingDetail(
    "listing-gastro-details",
  );

  return (
    listingId: string,
    detailId: string,
    data: {
      listing?: GastroListingUpdate;
      detail?: Partial<ListingGastroDetail>;
    },
  ) =>
    Promise.all([
      ...(data.listing
        ? [updateListing({ id: listingId, data: data.listing })]
        : []),
      ...(data.detail
        ? [updateDetail({ id: detailId, data: data.detail })]
        : []),
    ]);
}

export function useUpdateVenueListing(companyId: string) {
  const { mutateAsync: updateListing } = useUpdateListing(companyId);
  const { mutateAsync: updateDetail } = useUpdateListingDetail(
    "listing-venue-details",
  );

  return (
    listingId: string,
    detailId: string,
    data: {
      listing?: VenueListingUpdate;
      detail?: Partial<ListingVenueDetail>;
    },
  ) =>
    Promise.all([
      ...(data.listing
        ? [updateListing({ id: listingId, data: data.listing })]
        : []),
      ...(data.detail
        ? [updateDetail({ id: detailId, data: data.detail })]
        : []),
    ]);
}

export function useUpdateEntertainmentListing(companyId: string) {
  const { mutateAsync: updateListing } = useUpdateListing(companyId);
  const { mutateAsync: updateDetail } = useUpdateListingDetail(
    "listing-entertainment-details",
  );

  return (
    listingId: string,
    detailId: string,
    data: {
      listing?: EntertainmentListingUpdate;
      detail?: Partial<ListingEntertainmentDetail>;
    },
  ) =>
    Promise.all([
      ...(data.listing
        ? [updateListing({ id: listingId, data: data.listing })]
        : []),
      ...(data.detail
        ? [updateDetail({ id: detailId, data: data.detail })]
        : []),
    ]);
}
