"use client";

import Button from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import { useAuth } from "@/app/context/auth/auth-context";
import { useCompany } from "@/app/react-query/companies/hooks";
import { Company, Listing, User } from "@roo/common";
import { Settings } from "lucide-react";

interface Props {
  listing: Listing;
  companyId: string;
}

function hasListingRights(user: User | null, company: Company | undefined): boolean {
  if (!user || !company) return false;

  const ownerId = typeof company.owner === "string" ? company.owner : company.owner.id;
  if (ownerId === user.id) return true;

  return (company.collaborators ?? []).some((c) => {
    const collaboratorId = typeof c.user === "string" ? c.user : c.user.id;
    return collaboratorId === user.id;
  });
}

export default function ListingAdminSection({ listing, companyId }: Props) {
  const { user, isAuthenticated } = useAuth();
  const { data: company } = useCompany(companyId);

  if (!isAuthenticated || !hasListingRights(user, company)) return null;

  const listingId = listing.id;

  return (
    <div className="flex items-center justify-between px-5 py-4 bg-listing-surface rounded-2xl border border-indigo-100">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-listing flex items-center justify-center shrink-0">
          <Settings size={15} className="text-white" />
        </div>
        <div className="flex flex-col gap-0.5">
          <Text variant="label-lg" color="listing">
            Správa inzerátu
          </Text>
          <Text variant="caption" color="textLight">
            Máte přístup k tomuto inzerátu
          </Text>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          text="Upravit"
          version="listing"
          size="sm"
          iconLeft="Pencil"
          linkTarget="_blank"
          link={{
            pathname:
              "/company-profile/companies/[companyId]/listings/[listingId]/edit",
            params: { companyId, listingId },
          }}
        />
        <Button
          text="Poptávky"
          version="listing"
          size="sm"
          iconLeft="MessageSquare"
          linkTarget="_blank"
          link={{
            pathname:
              "/company-profile/companies/[companyId]/listings/[listingId]/inquiries",
            params: { companyId, listingId },
          }}
        />
        <Button
          text="Správa"
          version="listingFull"
          size="sm"
          iconLeft="Settings"
          linkTarget="_blank"
          link={{
            pathname:
              "/company-profile/companies/[companyId]/listings/[listingId]",
            params: { companyId, listingId },
          }}
        />
      </div>
    </div>
  );
}
