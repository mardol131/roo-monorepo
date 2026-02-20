import React from "react";
import Image from "next/image";
import Text from "../atoms/text";
import Button from "../atoms/button";

type Props = {
  image: string;
  title: string;
  text: string;
  buttonText: string;
  link: string;
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
  rotate = false,
}: Props) {
  return (
    <div className="w-full bg-gradient-to-r from-zinc-50 to-white rounded-2xl shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center min-h-80">
        {/* Left Content */}
        <div className="p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col items-start justify-center gap-6 order-2 md:order-1">
          <div className="flex flex-col gap-3 sm:gap-4">
            <Text
              variant="heading3"
              className="text-zinc-900 text-2xl sm:text-3xl lg:text-4xl"
            >
              {title}
            </Text>
            <Text
              variant="subheading0"
              className="text-zinc-600 text-base sm:text-lg"
            >
              {text}
            </Text>
          </div>

          <Button text={buttonText} version="primary" size="lg" link={link} />
        </div>

        {/* Right Image */}
        <div className="relative w-full h-full order-1 md:order-2">
          <Image
            src={image}
            alt={imageAlt || title}
            width={600}
            height={400}
            className={`object-cover object-center w-full rounded-2xl h-full ${rotate ? "md:-rotate-3" : ""}`}
            priority
          />
        </div>
      </div>
    </div>
  );
}
