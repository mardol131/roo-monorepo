import Text from "@/app/components/ui/atoms/text";
import { Building2, MapPin, Star } from "lucide-react";
import SectionHeader from "./section-header";
import { Company } from "@roo/common";

type Props = {
  company: Company;
};

export default function CompanyCard({ company }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 flex flex-col">
      <SectionHeader icon={Building2} title="Informace o dodavateli" />
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
