import Text from "@/app/components/ui/atoms/text";
import { Link } from "@/app/i18n/navigation";
import { Company } from "@roo/common";
import { Building2, ChevronRight, Globe, Mail, MapPin } from "lucide-react";

type Props = {
  company: Company;
};

export default function CompanyCard({ company }: Props) {
  return (
    <Link
      href={{
        pathname: "/company-profile/companies/[companyId]",
        params: { companyId: company.id },
      }}
      className="group bg-white rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition-all px-6 py-5 flex items-center gap-5"
    >
      {/* Icon */}
      <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
        <Building2 className="w-5 h-5 text-rose-500" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1.5">
          <Text variant="label1" color="dark" className="font-semibold truncate">
            {company.name}
          </Text>
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full shrink-0 bg-zinc-100 text-zinc-500">
            IČO {company.ico}
          </span>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs text-zinc-500">
            <MapPin className="w-3.5 h-3.5" />
            {company.city.label}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Mail className="w-3.5 h-3.5" />
            {company.email}
          </span>
          {company.website && (
            <span className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Globe className="w-3.5 h-3.5" />
              {company.website.replace("https://", "")}
            </span>
          )}
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors shrink-0" />
    </Link>
  );
}
