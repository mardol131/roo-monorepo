import { Listing } from "@roo/common";
import EntertainmentSection from "./entertainment-section";
import GastroSection from "./gastro-section";
import VenueSection from "./venue-section";

interface Props {
  listing: Listing;
}

export default function ListingDetailSection({ listing }: Props) {
  const detail = listing.details[0];
  if (!detail) return null;

  if (detail.blockType === "venue")
    return <VenueSection listing={listing} detail={detail} />;
  if (detail.blockType === "gastro")
    return <GastroSection listing={listing} detail={detail} />;
  return <EntertainmentSection listing={listing} detail={detail} />;
}
