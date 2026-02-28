import Text from "@/app/components/ui/atoms/text";
import { MapPin, Star } from "lucide-react";
import type { Inquiry } from "../types";
import SectionHeader from "./section-header";

type Props = {
  supplier: Inquiry["supplier"];
};

export default function SupplierCard({ supplier }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 flex flex-col gap-3">
      <SectionHeader icon={Star} title="Informace o dodavateli" />
      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <Text variant="label1" color="dark" className="font-semibold">
            {supplier.rating}
          </Text>
          <Text variant="label4" color="secondary">
            ({supplier.reviewCount} recenzí)
          </Text>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
          <MapPin className="w-3.5 h-3.5" />
          {supplier.location}
        </span>
      </div>
    </div>
  );
}
