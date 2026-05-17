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

  if (detail.blockType === "venue") return <VenueSection detail={detail} />;
  if (detail.blockType === "gastro") return <GastroSection detail={detail} />;
  return <EntertainmentSection detail={detail} />;
}
