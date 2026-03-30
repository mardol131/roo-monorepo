import Text from "@/app/components/ui/atoms/text";
import { Link } from "@/app/i18n/navigation";
import { Listing } from "@roo/common";
import { Briefcase, ChevronRight, Layers, MapPin, Star } from "lucide-react";

type Props = {
  listing: Listing;
  companyId: string;
};

export default function ListingCard({ listing, companyId }: Props) {
  return (
    <Link
      href={{
        pathname: "/company-profile/companies/[companyId]/listings/[listingId]",
        params: { companyId, listingId: listing.id },
      }}
      className="group bg-white rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition-all px-6 py-5 flex items-center gap-5"
    >
      {/* Icon */}
      <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
        <Briefcase className="w-5 h-5 text-violet-500" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1.5">
          <Text variant="label1" color="dark" className="font-semibold truncate">
            {listing.name}
          </Text>
          {listing.priceFrom && (
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full shrink-0 bg-violet-50 text-violet-600">
              od {listing.priceFrom.toLocaleString("cs-CZ")} Kč {listing.priceDuration}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs text-zinc-500">
            <MapPin className="w-3.5 h-3.5" />
            {listing.city.label}
          </span>
          {listing.variantsCount !== undefined && (
            <span className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Layers className="w-3.5 h-3.5" />
              {listing.variantsCount} {listing.variantsCount === 1 ? "varianta" : listing.variantsCount < 5 ? "varianty" : "variant"}
            </span>
          )}
          {listing.rating !== undefined && (
            <span className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              {listing.rating.toFixed(1)}
              {listing.reviewsCount !== undefined && (
                <span className="text-zinc-400">({listing.reviewsCount})</span>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors shrink-0" />
    </Link>
  );
}
