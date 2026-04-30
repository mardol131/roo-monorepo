import { DashboardSection } from "./dashboard-section";
import InfoSection from "./info-section";
import { Variant } from "@roo/common";
import { Check, Package, X } from "lucide-react";

type Props = {
  variant: Variant;
  title?: string;
};

export default function VariantSection({
  variant,
  title = "Nabídka dodavatele",
}: Props) {
  const includes =
    variant.includes?.filter(
      (i): i is { item?: string | null; id?: string | null } =>
        typeof i !== "string",
    ) ?? [];

  const excludes =
    variant.excludes?.filter(
      (i): i is { item?: string | null; id?: string | null } =>
        typeof i !== "string",
    ) ?? [];

  const infoItems = [
    { type: "text" as const, label: "Název", value: variant.name },
    ...(variant.description
      ? [{ type: "text" as const, label: "Popis", value: variant.description }]
      : []),
    {
      type: "text" as const,
      label: "Cena",
      value: `${variant.price.generalPrice.toLocaleString("cs-CZ")} Kč`,
    },
  ];

  return (
    <>
      <DashboardSection
        title={title}
        icon={"Package"}
        iconBg="bg-variant-surface"
        iconColor="text-variant"
      >
        <InfoSection items={infoItems} />
      </DashboardSection>

      {(includes.length > 0 || excludes.length > 0) && (
        <div className="grid grid-cols-2 gap-4">
          {includes.length > 0 && (
            <DashboardSection
              title="Součástí"
              icon={"Check"}
              iconBg="bg-emerald-50"
              iconColor="text-emerald-500"
            >
              <div className="flex flex-col gap-1.5">
                {includes.map((item) => (
                  <span
                    key={item.id}
                    className="flex items-center gap-2 text-xs text-zinc-700"
                  >
                    <Check
                      className="w-3.5 h-3.5 text-emerald-500 shrink-0"
                      strokeWidth={2.5}
                    />
                    {item.item}
                  </span>
                ))}
              </div>
            </DashboardSection>
          )}
          {excludes.length > 0 && (
            <DashboardSection
              title="Není součástí"
              icon={"X"}
              iconBg="bg-red-50"
              iconColor="text-red-400"
            >
              <div className="flex flex-col gap-1.5">
                {excludes.map((item) => (
                  <span
                    key={item.id}
                    className="flex items-center gap-2 text-xs text-zinc-500"
                  >
                    <X
                      className="w-3.5 h-3.5 text-red-400 shrink-0"
                      strokeWidth={2.5}
                    />
                    {item.item}
                  </span>
                ))}
              </div>
            </DashboardSection>
          )}
        </div>
      )}
    </>
  );
}
