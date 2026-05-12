import Text from "@/app/components/ui/atoms/text";
import { generateMediaUrl } from "@/app/functions/generate-media-url";
import { useCompany } from "@/app/react-query/companies/hooks";
import { useListingsByCompany } from "@/app/react-query/listings/hooks";
import Image from "next/image";
import React from "react";

interface BusinessProfileProps {
  companyId?: string;
}

export default function BusinessProfile({ companyId }: BusinessProfileProps) {
  const { data: company, isFetching } = useCompany(companyId);
  const { data: listings } = useListingsByCompany(companyId ?? "");

  if (isFetching) return null;

  const nameInitials = company?.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col gap-6 rounded-lg">
      <Text variant="h4" color="textDark">
        O pronajímateli
      </Text>
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          {company?.logo?.filename ? (
            <Image
              src={generateMediaUrl(company.logo.filename)}
              alt={company.name}
              width={80}
              height={80}
              className="rounded-full object-cover w-15 h-15"
            />
          ) : (
            <div className="w-15 h-15 rounded-full bg-primary flex items-center justify-center">
              <Text variant="h4" color="white">
                {nameInitials}
              </Text>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Text variant="label-lg" as="p" color="textDark">
            {company?.name}
          </Text>
          <Text variant="label" color="secondary">
            Počet inzerátů: {listings?.docs?.length ?? 0}
          </Text>
        </div>
      </div>
    </div>
  );
}
