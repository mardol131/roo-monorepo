import Text from "@/app/components/ui/atoms/text";
import { IntlLink, Link } from "@/app/i18n/navigation";
import Image from "next/image";

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
      <div className="group relative aspect-square rounded-3xl overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
        <div className="absolute inset-0 flex flex-col items-start justify-end p-8">
          <Text variant="display-xl" color="white">
            {title}
          </Text>
          <Text variant="body-lg" color="white" className="opacity-85 mt-1">
            {text}
          </Text>
        </div>
      </div>
    </Link>
  );
}
