import Text from "@/app/components/ui/atoms/text";
import { generateMediaUrl } from "@/app/functions/generate-media-url";
import { Listing } from "@roo/common";
import Image from "next/image";

type Reference = NonNullable<Listing["references"]>[number];

interface Props {
  references: Reference[];
}

export default function ReferencesSection({ references }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {references.map((ref) => (
        <div
          key={ref.id ?? ref.eventName}
          className="flex flex-col rounded-xl overflow-hidden border border-zinc-100"
        >
          {ref.image.filename && (
            <div className="relative w-full aspect-video">
              <Image
                src={generateMediaUrl(ref.image.filename)}
                alt={ref.image.alt ?? ref.eventName}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex flex-col gap-1.5 p-4">
            <Text variant="label-lg" color="textDark" className="font-semibold">
              {ref.eventName}
            </Text>
            {ref.clientName && (
              <Text
                as="span"
                variant="caption"
                color="primary"
                className="uppercase"
              >
                {ref.clientName}
              </Text>
            )}
            {ref.description && (
              <Text
                variant="body-sm"
                color="textLight"
                className="mt-1 line-clamp-3"
              >
                {ref.description}
              </Text>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
