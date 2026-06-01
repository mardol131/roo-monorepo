"use client";

import { Link } from "@/app/i18n/navigation";
import { useCompanies } from "@/app/react-query/companies/hooks";
import { useEvents } from "@/app/react-query/events/hooks";
import { useInquiries } from "@/app/react-query/inquiries/hooks";
import { useListings } from "@/app/react-query/listings/hooks";
import { useSpaces } from "@/app/react-query/spaces/hooks";
import { useVariants } from "@/app/react-query/variants/hooks";
import Text from "@/app/components/ui/atoms/text";
import { useDebouncedValue } from "@/app/hooks/use-debounced-value";
import { getIdFromRelationshipField } from "@roo/common";
import type {
  Listing,
  Space,
  Variant,
  Inquiry,
  Event,
  Company,
} from "@roo/common";
import {
  Building2,
  Tag,
  Layers,
  LayoutGrid,
  CalendarDays,
  MessageSquare,
} from "lucide-react";

type Props = {
  search: string;
  isOpen: boolean;
  userId: string;
  isCompanyProfile: boolean;
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Text
        variant="label-sm"
        color="textLight"
        className="block px-3 pt-3 pb-1"
      >
        {title}
      </Text>
      {children}
    </div>
  );
}

export function NavbarSearchDropdown({
  search,
  isOpen,
  userId,
  isCompanyProfile,
}: Props) {
  const debouncedSearch = useDebouncedValue(search, 300);
  const hasSearch = debouncedSearch.length > 0;

  const ownershipFilter = {
    or: [{ owner: { equals: userId } }, { "members.user": { equals: userId } }],
  };

  const { data: userCompanies } = useCompanies({
    options: { query: ownershipFilter, limit: 100 },
    enabled: !!userId && isCompanyProfile,
  });

  const companyIds = userCompanies?.docs?.map((c) => c.id) ?? [];
  const canSearch = isCompanyProfile
    ? companyIds.length > 0 && hasSearch && isOpen
    : hasSearch && isOpen;

  const { data: companies } = useCompanies({
    options: {
      query: {
        and: [{ name: { contains: debouncedSearch } }, ownershipFilter],
      },
      limit: 5,
    },
    enabled: isCompanyProfile && canSearch,
  });

  const { data: listings } = useListings({
    options: {
      query: {
        and: [
          { name: { contains: debouncedSearch } },
          { company: { in: companyIds } },
        ],
      },
      limit: 5,
    },
    enabled: isCompanyProfile && canSearch && companyIds.length > 0,
  });

  const { data: variants } = useVariants(
    {
      query: {
        and: [
          { name: { contains: debouncedSearch } },
          { "listing.company": { in: companyIds } },
        ],
      },
      limit: 5,
    },
    isCompanyProfile && canSearch && companyIds.length > 0,
  );

  const { data: spaces } = useSpaces(
    {
      query: {
        and: [
          { name: { contains: debouncedSearch } },
          { "listing.company": { in: companyIds } },
        ],
      },
      limit: 5,
    },
    isCompanyProfile && canSearch && companyIds.length > 0,
  );

  const { data: userEvents } = useEvents({
    options: {
      query: {
        and: [
          { owner: { equals: userId } },
          {
            or: [
              { status: { equals: "active" } },
              { status: { equals: "completed" } },
            ],
          },
        ],
      },
      limit: 100,
    },
    enabled: !isCompanyProfile && !!userId,
  });

  const eventsDocs: Event[] = hasSearch
    ? (userEvents?.docs ?? []).filter((e) =>
        e.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
      )
    : [];

  const matchingEventIds = userEvents?.docs?.map((e) => e.id) ?? [];

  const { data: inquiries } = useInquiries({
    options: {
      query: { event: { in: matchingEventIds } },
      limit: 5,
    },
    enabled: !isCompanyProfile && canSearch && matchingEventIds.length > 0,
  });

  if (!isOpen) return null;

  const companiesDocs: Company[] = companies?.docs ?? [];
  const listingsDocs: Listing[] = listings?.docs ?? [];
  const variantsDocs: Variant[] = variants?.docs ?? [];
  const spacesDocs: Space[] = spaces?.docs ?? [];
  const inquiriesDocs: Inquiry[] = inquiries?.docs ?? [];

  const hasResults = isCompanyProfile
    ? companiesDocs.length +
        listingsDocs.length +
        variantsDocs.length +
        spacesDocs.length >
      0
    : eventsDocs.length + inquiriesDocs.length > 0;

  return (
    <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-zinc-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      {hasSearch && !hasResults && (
        <div className="px-3 py-4">
          <Text variant="body-sm" color="textLight">
            Žádné výsledky
          </Text>
        </div>
      )}

      {isCompanyProfile && (
        <>
          {companiesDocs.length > 0 && (
            <Section title="Firmy">
              {companiesDocs.map((company) => (
                <Link
                  key={company.id}
                  href={{
                    pathname: "/company-profile/companies/[companyId]",
                    params: { companyId: company.id },
                  }}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-50 rounded"
                >
                  <Building2 className="w-3.5 h-3.5 text-company shrink-0" />
                  <Text variant="body-sm">{company.name}</Text>
                </Link>
              ))}
            </Section>
          )}

          {listingsDocs.length > 0 && (
            <Section title="Inzeráty">
              {listingsDocs.map((listing) => (
                <Link
                  key={listing.id}
                  href={{
                    pathname:
                      "/company-profile/companies/[companyId]/listings/[listingId]",
                    params: {
                      companyId: getIdFromRelationshipField(listing.company),
                      listingId: listing.id,
                    },
                  }}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-50 rounded"
                >
                  <Tag className="w-3.5 h-3.5 text-listing shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <Text variant="body-sm">{listing.name}</Text>
                    {typeof listing.company === "object" && (
                      <Text variant="label-sm" color="textLight">
                        {listing.company.name}
                      </Text>
                    )}
                  </div>
                </Link>
              ))}
            </Section>
          )}

          {variantsDocs.length > 0 && (
            <Section title="Varianty">
              {variantsDocs
                .filter(
                  (v): v is Variant & { listing: Listing } =>
                    typeof v.listing === "object",
                )
                .map((variant) => {
                  const listing = variant.listing;
                  return (
                    <Link
                      key={variant.id}
                      href={{
                        pathname:
                          "/company-profile/companies/[companyId]/listings/[listingId]/variants/[variantId]",
                        params: {
                          companyId: getIdFromRelationshipField(
                            listing.company,
                          ),
                          listingId: listing.id,
                          variantId: variant.id,
                        },
                      }}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-50 rounded"
                    >
                      <Layers className="w-3.5 h-3.5 text-listing shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <Text variant="body-sm">{variant.name}</Text>
                        <Text variant="label-sm" color="textLight">
                          {listing.name}
                        </Text>
                      </div>
                    </Link>
                  );
                })}
            </Section>
          )}

          {spacesDocs.length > 0 && (
            <Section title="Prostory">
              {spacesDocs
                .filter(
                  (s): s is Space & { listing: Listing } =>
                    typeof s.listing === "object",
                )
                .map((space) => {
                  const listing = space.listing;
                  return (
                    <Link
                      key={space.id}
                      href={{
                        pathname:
                          "/company-profile/companies/[companyId]/listings/[listingId]/spaces/[spaceId]/edit",
                        params: {
                          companyId: getIdFromRelationshipField(
                            listing.company,
                          ),
                          listingId: listing.id,
                          spaceId: space.id,
                        },
                      }}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-50 rounded"
                    >
                      <LayoutGrid className="w-3.5 h-3.5 text-space shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <Text variant="body-sm">{space.name}</Text>
                        <Text variant="label-sm" color="textLight">
                          {listing.name}
                        </Text>
                      </div>
                    </Link>
                  );
                })}
            </Section>
          )}
        </>
      )}

      {!isCompanyProfile && (
        <>
          {eventsDocs.length > 0 && (
            <Section title="Akce">
              {eventsDocs.map((event) => (
                <Link
                  key={event.id}
                  href={{
                    pathname: "/user-profile/events/[eventId]",
                    params: { eventId: event.id },
                  }}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-50 rounded"
                >
                  <CalendarDays className="w-3.5 h-3.5 text-event shrink-0" />
                  <Text variant="body-sm">{event.name}</Text>
                </Link>
              ))}
            </Section>
          )}

          {inquiriesDocs.length > 0 && (
            <Section title="Poptávky">
              {inquiriesDocs.map((inquiry) => {
                const eventId = getIdFromRelationshipField(inquiry.event);
                const eventName =
                  userEvents?.docs?.find((e) => e.id === eventId)?.name ?? null;
                const listingName =
                  typeof inquiry.listing === "object"
                    ? inquiry.listing.name
                    : null;
                return (
                  <Link
                    key={inquiry.id}
                    href={{
                      pathname:
                        "/user-profile/events/[eventId]/inquiries/[inquiryId]",
                      params: { eventId, inquiryId: inquiry.id },
                    }}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-50 rounded"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-inquiry shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <Text variant="body-sm">{listingName ?? "Poptávka"}</Text>
                      {eventName && (
                        <Text variant="label-sm" color="textLight">
                          {eventName}
                        </Text>
                      )}
                    </div>
                  </Link>
                );
              })}
            </Section>
          )}
        </>
      )}
    </div>
  );
}
