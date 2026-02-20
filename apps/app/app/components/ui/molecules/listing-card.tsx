"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import Text from "../atoms/text";
import { Heart, Star } from "lucide-react";
import { FaHeart, FaStar } from "react-icons/fa";

type Props = {
  imageUrl: string;
  title: string;
  price: string;
  imageAlt?: string;
  liked?: boolean;
};

export default function ListingCard({
  imageUrl,
  title,
  price,
  imageAlt,
  liked = false,
}: Props) {
  const [isLiked, setIsLiked] = useState(liked);

  const clickOnLikedHandler = useCallback(
    (e: React.MouseEvent<SVGAElement | SVGElement, MouseEvent>) => {
      e.stopPropagation();
      setIsLiked((prev) => !prev);
    },
    [isLiked],
  );

  return (
    <div className="group rounded-xl transition ease-in-out">
      <div className="relative min-w-60 w-full rounded-xl aspect-square bg-zinc-100 overflow-hidden">
        <Image
          src={imageUrl}
          alt={imageAlt || title}
          className="object-cover w-full h-full object-center transition-transform duration-300 group-hover:scale-105"
          width={1000}
          height={1000}
        />
        <FaHeart
          onClick={clickOnLikedHandler}
          size={24}
          className={`absolute top-3 right-3 text-primary cursor-pointer ${isLiked ? "text-rose-500" : "text-secondary/80"} transition-colors duration-200 hover:text-rose-500`}
        />
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="p-3 flex flex-col gap-1">
          <Text variant="label1" className="">
            {title}
          </Text>
          <Text variant="body5" color="light" className="font-semibold">
            Cena začíná od <span className="text-primary">{price} Kč</span>
          </Text>
        </div>
        <div className="p-3 flex items-center gap-1">
          <span className="font-semibold">5</span>{" "}
          <FaStar size={16} className="text-rose-500" />
        </div>
      </div>
    </div>
  );
}
