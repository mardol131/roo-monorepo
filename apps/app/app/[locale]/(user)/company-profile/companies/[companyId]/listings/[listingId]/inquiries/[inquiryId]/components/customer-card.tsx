import DashboardSectionHeader from "@/app/[locale]/(user)/components/dashboard-section-header";
import type { User } from "@roo/common";
import { UserCircle } from "lucide-react";

type Props = {
  user: string | User;
};

export default function CustomerCard({ user }: Props) {
  if (typeof user === "string") return null;

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
      <DashboardSectionHeader
        icon={"UserCircle"}
        heading="Informace o zákazníkovi"
        iconBgColor="bg-zinc-100"
        iconColor="text-zinc-500"
      />
      <div className="px-5 py-4 flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-zinc-900">
          {user.firstName} {user.lastName}
        </span>
        <span className="text-sm text-zinc-500">{user.email}</span>
      </div>
    </div>
  );
}
