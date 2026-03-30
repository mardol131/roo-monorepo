import Text from "@/app/components/ui/atoms/text";
import { Link } from "@/app/i18n/navigation";
import { Listing } from "@roo/common";
import { Briefcase, ChevronRight, Layers, MapPin, Star } from "lucide-react";

type Props = { listing: Listing; companyId: string };

export default function ListingRow({ listing, companyId }: Props) {
  return (
    <Link
      href={{
        pathname: "/company-profile/companies/[companyId]/listings/[listingId]",
        params: { companyId, listingId: listing.id },
      }}
      className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-50 transition-colors group"
    >
      <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
        <Briefcase className="w-4 h-4 text-violet-500" />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Text variant="label1" color="dark" className="font-medium truncate">
          {listing.name}
        </Text>
        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-zinc-400">
            <MapPin className="w-3 h-3" />
            {listing.city.label}
          </span>
          {listing.variantsCount !== undefined && (
            <span className="flex items-center gap-1 text-xs text-zinc-400">
              <Layers className="w-3 h-3" />
              {listing.variantsCount}{" "}
              {listing.variantsCount === 1
                ? "varianta"
                : listing.variantsCount < 5
                  ? "varianty"
                  : "variant"}
            </span>
          )}
          {listing.rating !== undefined && (
            <span className="flex items-center gap-1 text-xs text-zinc-400">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              {listing.rating.toFixed(1)}
              {listing.reviewsCount !== undefined && (
                <span className="text-zinc-300">({listing.reviewsCount})</span>
              )}
            </span>
          )}
        </div>
      </div>

      {listing.priceFrom && (
        <span className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0 bg-violet-50 text-violet-600 hidden sm:block">
          od {listing.priceFrom.toLocaleString("cs-CZ")} Kč{" "}
          {listing.priceDuration}
        </span>
      )}

      <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition-colors shrink-0" />
    </Link>
  );
}
