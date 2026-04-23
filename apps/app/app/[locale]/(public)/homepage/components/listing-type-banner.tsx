import Text from "@/app/components/ui/atoms/text";
import { IntlLink, Link } from "@/app/i18n/navigation";
import { ComponentProps } from "react";

type Props = {
  imageUrl: string;
  title: string;
  text: string;
  link: IntlLink;
};

export default function ListingTypeBanner({
  imageUrl,
  title,
  link,
  text,
}: Props) {
  return (
    <Link href={link}>
      <div
        style={{
          backgroundImage: `url('${imageUrl}')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          objectFit: "cover",
        }}
        className="group aspect-square rounded-3xl overflow-hidden"
      >
        <div className="bg-linear-0 group-hover:contrast-180 transition-all ease-in-out from-black/80 to-white/20 w-full h-full flex flex-col items-start justify-end p-10">
          <Text variant="display-xl" color="white">
            {title}
          </Text>
          <Text variant="body-lg" color="white">
            {text}
          </Text>
        </div>
      </div>
    </Link>
  );
}
