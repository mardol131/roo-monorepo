import DashboardSectionHeader from "@/app/[locale]/(user)/components/dashboard-section-header";
import { Settings } from "lucide-react";
import CancelButton from "./cancel-button";

export default function InquirySettings() {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
      <DashboardSectionHeader
        icon={"Settings"}
        heading="Nastavení poptávky"
        iconBgColor="bg-zinc-100"
        iconColor="text-zinc-700"
      />
      <div className="p-5">
        <CancelButton />
      </div>
    </div>
  );
}
