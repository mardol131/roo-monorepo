import Text from "@/app/components/ui/atoms/text";
import { generateMediaUrl } from "@/app/functions/generate-media-url";
import { Listing, ListingVenueDetail } from "@roo/common";
import Image from "next/image";

type CustomSectionBlock = NonNullable<
  ListingVenueDetail["customSections"]
>[number];

interface Props {
  section: CustomSectionBlock;
}

const imageCountGridClass: Record<string, string> = {
  gallery1: "grid-cols-1",
  gallery2: "grid-cols-2",
  gallery4: "grid-cols-2",
  gallery5: "grid-cols-2",
};

export default function CustomSection({ section }: Props) {
  const images = section.images ?? [];
  const gridClass = imageCountGridClass[section.blockType] ?? "grid-cols-2";

  const renderImages = () => {
    if (section.blockType === "gallery5") {
      const [first, ...rest] = images;
      return (
        <div className={`grid ${gridClass} gap-3`}>
          {first?.filename && (
            <div className="relative rounded-xl aspect-square overflow-hidden row-span-2">
              <Image
                src={generateMediaUrl(first.filename)}
                alt={first.alt ?? ""}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            {rest.map((img, i) =>
              img.filename ? (
                <div
                  key={i}
                  className="relative rounded-xl aspect-square overflow-hidden"
                >
                  <Image
                    src={generateMediaUrl(img.filename)}
                    alt={img.alt ?? ""}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : null,
            )}
          </div>
        </div>
      );
    }

    return (
      <div className={`grid ${gridClass} gap-3`}>
        {images.map((img, i) =>
          img.filename ? (
            <div
              key={i}
              className="relative aspect-[4/3] rounded-xl overflow-hidden"
            >
              <Image
                src={generateMediaUrl(img.filename)}
                alt={img.alt ?? ""}
                fill
                className="object-cover"
              />
            </div>
          ) : null,
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {images.length > 0 && renderImages()}
      {section.text && (
        <Text variant="body" color="textLight">
          {section.text}
        </Text>
      )}
    </div>
  );
}
