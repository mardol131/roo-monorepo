import Text from "@/app/components/ui/atoms/text";
import { useFilterOptions } from "@/app/react-query/filters/aggregated-filters/hooks";
import { Listing } from "@roo/common";
import { Building2, Tag, Utensils, Music } from "lucide-react";

const listingTypeConfig: Record<
  Listing["type"],
  { label: string; Icon: React.ElementType }
> = {
  venue: { label: "Prostory & Venue", Icon: Building2 },
  gastro: { label: "Catering", Icon: Utensils },
  entertainment: { label: "Zábava & Program", Icon: Music },
};

interface Props {
  listing: Listing;
}

export default function ListingHeader({ listing }: Props) {
  const { data: filters } = useFilterOptions();
  const eventTypes = (listing.properties.eventTypes ?? []).flatMap((id) => {
    const found = filters?.eventTypes.find((e) => e.id === id);
    return found ? [found.name] : [];
  });

  const environment =
    listing.indoor && listing.outdoor
      ? "Interiér i exteriér"
      : listing.indoor
        ? "Interiér"
        : listing.outdoor
          ? "Exteriér"
          : null;

  return (
    <div className="flex flex-col gap-4 py-8 border-b border-zinc-100">
      <Text
        variant="display-lg"
        color="textDark"
        className="font-display uppercase tracking-[0.08em]"
      >
        {listing.name}
      </Text>

      {listing.shortDescription && (
        <Text variant="body-lg" color="textLight">
          {listing.shortDescription}
        </Text>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {(() => {
          const { label, Icon } = listingTypeConfig[listing.type];
          return (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 rounded-md">
              <Icon size={11} className="text-white shrink-0" />
              <Text as="span" variant="label" className="text-white">
                {label}
              </Text>
            </span>
          );
        })()}
        {environment && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/8 rounded-md">
            <Text as="span" variant="label" color="primary">
              {environment}
            </Text>
          </span>
        )}
        {eventTypes.map((name) => (
          <span
            key={name}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 bg-white rounded-md"
          >
            <Tag size={11} className="text-zinc-400 shrink-0" />
            <Text as="span" variant="label" color="textLight">
              {name}
            </Text>
          </span>
        ))}
      </div>
    </div>
  );
}
