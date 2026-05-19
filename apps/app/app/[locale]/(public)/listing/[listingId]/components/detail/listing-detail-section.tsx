import { Listing } from "@roo/common";
import EntertainmentSection from "./entertainment-section";
import GastroSection from "./gastro-section";
import VenueSection from "./venue-section";

interface Props {
  listing: Listing;
}

export default function ListingDetailSection({ listing }: Props) {
  const detail = listing.detail;
  if (!detail || typeof detail.value === "string") return null;

  if (detail.relationTo === "listing-venue-details")
    return <VenueSection detail={detail.value} listing={listing} />;
  if (detail.relationTo === "listing-gastro-details")
    return <GastroSection detail={detail.value} listing={listing} />;
  if (detail.relationTo === "listing-entertainment-details")
    return <EntertainmentSection detail={detail.value} listing={listing} />;
}
