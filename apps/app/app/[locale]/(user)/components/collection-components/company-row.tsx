import Text from "@/app/components/ui/atoms/text";
import { Link } from "@/app/i18n/navigation";
import { Company } from "@roo/common";
import { Building2, ChevronRight, Globe, Mail, MapPin } from "lucide-react";

export default function CompanyRow({ company }: { company: Company }) {
  return (
    <Link
      href={{
        pathname: "/company-profile/companies/[companyId]",
        params: { companyId: company.id },
      }}
      className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-50 transition-colors group"
    >
      <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
        <Building2 className="w-4 h-4 text-rose-500" />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Text variant="label1" color="dark" className="font-medium truncate">
          {company.name}
        </Text>
        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-zinc-400">
            <MapPin className="w-3 h-3" />
            {company.city.label}
          </span>
          <span className="flex items-center gap-1 text-xs text-zinc-400">
            <Mail className="w-3 h-3" />
            {company.email}
          </span>
          {company.website && (
            <span className="flex items-center gap-1 text-xs text-zinc-400">
              <Globe className="w-3 h-3" />
              {company.website.replace("https://", "")}
            </span>
          )}
        </div>
      </div>

      <span className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0 bg-zinc-100 text-zinc-500 hidden sm:block">
        IČO {company.ico}
      </span>

      <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition-colors shrink-0" />
    </Link>
  );
}
