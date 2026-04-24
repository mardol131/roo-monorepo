import VariantSection from "@/app/[locale]/(user)/components/variant-section";
import { Variant } from "@roo/common";

type Props = {
  variant: Variant;
};

export default function EventDashboardVariantSection({ variant }: Props) {
  return <VariantSection variant={variant} />;
}
