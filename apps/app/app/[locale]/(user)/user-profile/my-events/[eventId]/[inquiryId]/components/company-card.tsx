import DashboardSectionHeader from "@/app/[locale]/(user)/components/dashboard-section-header";
import Text from "@/app/components/ui/atoms/text";
import { Company } from "@roo/common";
import { Building2 } from "lucide-react";

type Props = {
  company: Company;
};

export default function CompanyCard({ company }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 flex flex-col">
      <DashboardSectionHeader
        icon={Building2}
        heading="Informace o dodavateli"
        iconBgColor="bg-zinc-100"
        iconColor="text-zinc-700"
      />
      <div className="p-5 flex flex-col gap-4">
        <div className="flex flex-col">
          <Text variant="label-lg" color="textDark" className="font-semibold">
            {company.name}
          </Text>
          {company.description && (
            <Text variant="label" color="secondary" className="mt-1">
              {company.description}
            </Text>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Text variant="label-lg" color="textDark" className="font-semibold">
            IČO: {company.ico}
          </Text>
        </div>
      </div>
    </div>
  );
}
