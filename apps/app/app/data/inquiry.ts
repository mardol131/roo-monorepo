import { InquiryStatus } from "@roo/common";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

export const INQUIRY_STATUS: Record<
  InquiryStatus,
  {
    label: string;
    icon: React.ElementType;
    className: string;
    iconColor: string;
  }
> = {
  pending: {
    label: "Čeká na odpověď",
    icon: Clock,
    className: "bg-amber-100 text-amber-700",
    iconColor: "text-amber-500",
  },
  confirmed: {
    label: "Potvrzeno",
    icon: CheckCircle2,
    className: "bg-emerald-100 text-emerald-700",
    iconColor: "text-emerald-500",
  },
  declined: {
    label: "Odmítnuto",
    icon: XCircle,
    className: "bg-red-100 text-red-600",
    iconColor: "text-red-400",
  },
};
