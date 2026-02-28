import Text from "@/app/components/ui/atoms/text";
import { Settings } from "lucide-react";
import CancelButton from "./cancel-button";
import SectionHeader from "./section-header";

export default function InquirySettings() {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
      <SectionHeader icon={Settings} title="Nastavení poptávky" />
      <div className="p-5">
        <CancelButton />
      </div>
    </div>
  );
}
