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
import { MOCK_VARIANTS } from "@/app/_mock/mock";
import DashboardHeader from "@/app/[locale]/(user)/company-profile/components/dashboard-header";
import { SummaryCard } from "@/app/[locale]/(user)/user-profile/components/summary-card";
import Text from "@/app/components/ui/atoms/text";
import Breadcrumbs from "@/app/[locale]/(user)/components/breadcrumbs";
import VariantDashboardContent from "./content";

type Props = {
  params: Promise<{ companyId: string; listingId: string; variantId: string }>;
};

export default async function VariantDashboardPage({ params }: Props) {
  const { companyId, listingId, variantId } = await params;
  const variant =
    MOCK_VARIANTS.find((v) => v.id === variantId) ?? MOCK_VARIANTS[0];

  return (
    <main className="w-full">
      <Breadcrumbs />
      <DashboardHeader
        icon={Package}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-500"
        name={variant.name}
        nameSideComponent={
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
            {variant.price.generalPrice} Kč
          </span>
        }
        infoItems={
          [
            //   { icon: "Clock", text: variant.duration },
            //   ...(variant.availableDate
            //     ? [
            //         {
            //           icon: "CalendarCheck",
            //           text: `Dostupné od ${variant.availableDate}`,
            //         },
            //       ]
            //     : []),
          ]
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <SummaryCard
          label="Cena"
          value={`${variant.price.generalPrice} Kč`}
          icon={Banknote}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-500"
        />
        {/* <SummaryCard
          label="Délka trvání"
          value={variant.duration}
          icon={Clock}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
        />
        <SummaryCard
          label="Ideální pro"
          value={String(variant.idealFor.length)}
          icon={Users}
          iconBg="bg-violet-50"
          iconColor="text-violet-500"
          note={variant.idealFor.join(", ")}
        /> */}
      </div>
      <VariantDashboardContent
        variant={variant}
        companyId={companyId}
        listingId={listingId}
        variantId={variantId}
      />
    </main>
  );
}
