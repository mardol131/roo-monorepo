import Text from "@/app/components/ui/atoms/text";

type Props = {
  badge?: string;
  heading: string;
  subheading?: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  badge,
  heading,
  subheading,
  align = "center",
}: Props) {
  const alignClass =
    align === "center" ? "text-center items-center" : "items-start";

  return (
    <div className={`flex flex-col gap-3 mb-8 ${alignClass}`}>
      {badge && (
        <span className="inline-flex w-fit items-center rounded-full bg-company-surface px-3 py-1 text-sm font-medium text-company">
          {badge}
        </span>
      )}
      <Text variant="display-xl" color="textDark">
        {heading}
      </Text>
      {subheading && (
        <Text variant="body-lg" color="textLight">
          {subheading}
        </Text>
      )}
    </div>
  );
}
