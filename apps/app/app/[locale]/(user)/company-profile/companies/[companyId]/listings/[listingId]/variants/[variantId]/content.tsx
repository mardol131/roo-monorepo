"use client";

import {
  Package,
  Clock,
  Banknote,
  CheckCircle2,
  XCircle,
  Users,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Variant } from "@roo/common";
import { IntlLink } from "@/app/i18n/navigation";
import DashboardHeader from "@/app/[locale]/(user)/company-profile/components/dashboard-header";
import { SummaryCard } from "@/app/[locale]/(user)/user-profile/components/summary-card";
import Text from "@/app/components/ui/atoms/text";
import Button from "@/app/components/ui/atoms/button";
import { useState } from "react";

type SectionProps = {
  label: string;
  editLink: IntlLink;
  children: React.ReactNode;
};

function Section({ label, editLink, children }: SectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <Text variant="label2" color="dark" className="font-semibold">
          {label}
        </Text>
        <div>
          {isEditing ? (
            <>
              <Button
                link={editLink as any}
                text="Upravit"
                iconLeft="PenLine"
                size="sm"
                version="white"
              />
              <Button
                link={editLink as any}
                text="Upravit"
                iconLeft="PenLine"
                size="sm"
                version="white"
              />
            </>
          ) : (
            <Button
              link={editLink as any}
              text="Upravit"
              iconLeft="PenLine"
              size="sm"
              version="plain"
            />
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

type Props = {
  variant: Variant;
  companyId: string;
  listingId: string;
  variantId: string;
};

export default function VariantDashboardContent({
  variant,
  companyId,
  listingId,
  variantId,
}: Props) {
  const editLink = {
    pathname:
      "/company-profile/companies/[companyId]/listings/[listingId]/variants/[variantId]/edit" as const,
    params: { companyId, listingId, variantId },
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Description */}
      <Section label="Popis" editLink={editLink}>
        <Text variant="body2" color="secondary">
          {variant.description || "Popis nebyl vyplněn."}
        </Text>
      </Section>

      {/* Includes & Excludes */}
      <div className="grid grid-cols-2 gap-4">
        <Section label="Zahrnuto" editLink={editLink}>
          {variant.includes.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {variant.includes.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-zinc-600"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <Text variant="label4" color="secondary">
              Nic nezahrnuto.
            </Text>
          )}
        </Section>

        <Section label="Nezahrnuto" editLink={editLink}>
          {variant.excludes.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {variant.excludes.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-zinc-600"
                >
                  <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <Text variant="label4" color="secondary">
              Žádná omezení.
            </Text>
          )}
        </Section>
      </div>

      {/* Ideal for */}
      <Section label="Ideální pro" editLink={editLink}>
        {variant.idealFor.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {variant.idealFor.map((item) => (
              <span
                key={item}
                className="text-xs font-medium px-3 py-1 rounded-full bg-violet-50 text-violet-600"
              >
                {item}
              </span>
            ))}
          </div>
        ) : (
          <Text variant="label4" color="secondary">
            Cílová skupina nebyla specifikována.
          </Text>
        )}
      </Section>
    </div>
  );
}
