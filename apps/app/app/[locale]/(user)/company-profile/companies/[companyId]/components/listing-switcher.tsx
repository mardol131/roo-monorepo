"use client";

import Text from "@/app/components/ui/atoms/text";
import { useClickOutside } from "@/app/hooks/use-click-outside";
import { Link, useRouter } from "@/app/i18n/navigation";
import { Building2, ChevronsUpDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type Listing = {
  id: string;
  name: string;
};

type Props = {
  companies: Listing[];
  currentCompanyId: string;
};

export default function ListingSwitcher({
  companies,
  currentCompanyId,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = companies.find((c) => c.id === currentCompanyId);

  useClickOutside(ref, () => setOpen(false));

  if (!current) {
    return null;
  }

  return (
    <div className="relative p-3 border-b border-zinc-100" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-zinc-50 transition-all text-left"
      >
        <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
          <Building2 className="w-4 h-4 text-rose-500" />
        </div>
        <Text variant="label3"> {current.name}</Text>
        <ChevronsUpDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
      </button>

      {open && (
        <div className="absolute top-[100%] mt-1 rounded-xl border border-zinc-100 bg-white shadow-lg">
          {companies.map((company) => (
            <Link
              key={company.id}
              href={{
                pathname: "/company-profile/companies/[companyId]",
                params: { companyId: company.id },
              }}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2.5 text-sm transition-all ${
                company.id === currentCompanyId
                  ? "bg-rose-50 text-rose-600 font-medium"
                  : "text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              <div className="w-6 h-6 rounded-md bg-zinc-100 flex items-center justify-center shrink-0">
                <Building2 className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <span className="truncate">{company.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
