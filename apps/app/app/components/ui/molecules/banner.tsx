import React from "react";
import Image from "next/image";
import Text from "../atoms/text";
import Button from "../atoms/button";
import { IntlLink } from "@/app/i18n/navigation";

type Props = {
  image: string;
  title: string;
  text: string;
  buttonText: string;
  link: IntlLink;
  imageAlt?: string;
  rotate?: boolean;
};

export default function Banner({
  image,
  title,
  text,
  buttonText,
  link,
  imageAlt,
}: Props) {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden">
      <div className="relative h-80">
        <Image
          src={image}
          alt={imageAlt || title}
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-black/10" />
      </div>
      <div className="absolute inset-0 flex flex-col items-start justify-center gap-5 px-12 max-w-2xl">
        <div className="flex flex-col gap-2">
          <Text variant="display-xl" className="text-white">
            {title}
          </Text>
          <Text variant="body-lg" className="text-white/70">
            {text}
          </Text>
        </div>
        <Button text={buttonText} version="primary" size="lg" link={link} />
      </div>
    </div>
  );
}
