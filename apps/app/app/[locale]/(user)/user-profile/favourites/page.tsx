"use client";

import { useMemo, useState } from "react";
import PageHeading from "../../components/page-heading";
import { useFavouriteListings } from "@/app/react-query/favourite-listings/hooks";
import { useListings } from "@/app/react-query/listings/hooks";
import Loader from "../../components/loader";
import { EmptyState } from "../../components/empty-state";
import ListingCard from "@/app/components/ui/molecules/listing-card";
import TabFilter from "../../components/tab-filter";

const PAGE_SIZE = 10;

type ListingTypeFilter = "all" | "venue" | "gastro" | "entertainment";

const filters: { label: string; value: ListingTypeFilter }[] = [
  { label: "Vše", value: "all" },
  { label: "Venue", value: "venue" },
  { label: "Gastro", value: "gastro" },
  { label: "Entertainment", value: "entertainment" },
];

export default function FavoritesPage() {
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<ListingTypeFilter>("all");

  const { data: favourites, isPending: isFavouritesPending } =
    useFavouriteListings();
  const { data: allListings, isPending: isListingsPending } = useListings();

  const favouriteIds = useMemo(
    () =>
      new Set(
        favourites?.docs?.map((f) =>
          typeof f.listing === "string" ? f.listing : f.listing.id,
        ),
      ),
    [favourites],
  );

  const filteredListings = useMemo(() => {
    const favourites =
      allListings?.docs?.filter((l) => favouriteIds.has(l.id)) ?? [];
    if (activeFilter === "all") return favourites;
    return favourites.filter((l) => l.details[0].blockType === activeFilter);
  }, [allListings, favouriteIds, activeFilter]);

  const totalPages = Math.ceil(filteredListings.length / PAGE_SIZE);
  const paginatedListings = filteredListings.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  if (isFavouritesPending || isListingsPending)
    return <Loader text="Načítám oblíbené dodavatele..." />;

  return (
    <main className="flex-1">
      <PageHeading
        heading="Oblíbení dodavatelé"
        description="Přehled všech vašich oblíbených dodavatelů."
      />
      <TabFilter
        tabs={filters}
        activeTab={activeFilter}
        onChange={setActiveFilter}
        className="mb-6"
      />
      {filteredListings.length === 0 ? (
        <EmptyState
          subtext="Přidejte dodavatele do oblíbených a budou se zde zobrazovat."
          text="Nemáte žádné oblíbené dodavatele."
        />
      ) : (
        <>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
            {paginatedListings.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                title={listing.name}
                price={listing.price?.startsAt ?? "–"}
                imageUrl={
                  typeof listing.images?.coverImage === "string"
                    ? listing.images.coverImage
                    : ""
                }
                details={listing.details?.[0]}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex gap-2 mt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Předchozí
              </button>
              <span>
                {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Další
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
