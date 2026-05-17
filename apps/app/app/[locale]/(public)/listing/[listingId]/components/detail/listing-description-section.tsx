import { Listing } from "@roo/common";
import DescriptionSection from "../description-section";
import SectionWrapper from "../section-wrapper";

interface Props {
  listing: Listing;
}

export default function ListingDescriptionSection({ listing }: Props) {
  if (!listing.description) return null;
  return (
    <SectionWrapper title="O tomto inzerátu">
      <DescriptionSection description={listing.description} />
    </SectionWrapper>
  );
}
