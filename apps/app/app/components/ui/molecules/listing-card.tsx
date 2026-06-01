"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Text from "../atoms/text";
import { FaHeart, FaStar } from "react-icons/fa";
import { Link } from "@/app/i18n/navigation";
import {
  useCreateFavouriteListing,
  useDeleteFavouriteListing,
  useFavouriteListings,
} from "@/app/react-query/favourite-listings/hooks";
import { useAuth } from "@/app/context/auth/auth-context";
import { storage } from "@/app/local-storage/storage";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { generateMediaUrl } from "@/app/functions/generate-media-url";
import { truncateText } from "@roo/common";

type Props = {
  images: string[];
  id: string;
  title: string;
  shortDescription?: string;
  price: number;
  imageAlt?: string;
  linkTarget?: React.HTMLAttributeAnchorTarget;
};

export default function ListingCard({
  images,
  title,
  shortDescription,
  price,
  imageAlt,
  id,
  linkTarget = "_blank",
}: Props) {
  const { isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: favouriteListings } = useFavouriteListings();
  const { mutate: createFavouriteListing } = useCreateFavouriteListing();
  const { mutate: removeFavouriteListing } = useDeleteFavouriteListing();

  useEffect(() => {
    if (isAuthenticated) {
      const isFavourite = favouriteListings?.docs?.some((f) =>
        typeof f.listing === "string" ? f.listing === id : f.listing.id === id,
      );
      setIsLiked(Boolean(isFavourite));
    } else {
      const local = storage.read("favouriteListings") ?? [];
      setIsLiked(local.includes(id));
    }
  }, [isAuthenticated, favouriteListings, id]);

  const clickOnLikedHandler = useCallback(
    (e: React.MouseEvent<SVGAElement | SVGElement, MouseEvent>) => {
      e.stopPropagation();
      e.preventDefault();

      if (!isAuthenticated) {
        const current = storage.read("favouriteListings") ?? [];
        if (isLiked) {
          storage.write(
            "favouriteListings",
            current.filter((item) => item !== id),
          );
        } else {
          storage.write("favouriteListings", [...current, id]);
        }
        setIsLiked((prev) => !prev);
        return;
      }

      if (isLiked) {
        const record = favouriteListings?.docs?.find((f) =>
          typeof f.listing === "string"
            ? f.listing === id
            : f.listing.id === id,
        );
        if (record) removeFavouriteListing(record.id);
      } else {
        createFavouriteListing({ listing: id });
      }
      setIsLiked((prev) => !prev);
    },
    [
      isAuthenticated,
      isLiked,
      id,
      favouriteListings,
      createFavouriteListing,
      removeFavouriteListing,
    ],
  );

  const goTo = useCallback(
    (e: React.MouseEvent, index: number) => {
      e.preventDefault();
      e.stopPropagation();
      setCurrentIndex((index + images.length) % images.length);
    },
    [images.length],
  );

  const currentImage = images[currentIndex];
  const hasMultiple = images.length > 1;

  return (
    <Link
      href={{ pathname: "/listing/[listingId]", params: { listingId: id } }}
      target={linkTarget}
      className="group rounded-xl transition ease-in-out"
    >
      <div className="relative min-w-60 w-full rounded-xl aspect-square bg-zinc-100 overflow-hidden">
        <Image
          src={
            generateMediaUrl(currentImage).startsWith("http")
              ? generateMediaUrl(currentImage)
              : ""
          }
          alt={imageAlt || title}
          className="object-cover w-full h-full object-center transition-transform duration-300 group-hover:scale-105"
          width={1000}
          height={1000}
        />

        {hasMultiple && (
          <>
            <button
              onClick={(e) => goTo(e, currentIndex - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4 text-zinc-700" />
            </button>
            <button
              onClick={(e) => goTo(e, currentIndex + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronRight className="w-4 h-4 text-zinc-700" />
            </button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => goTo(e, i)}
                  className={`rounded-full transition-all ${
                    i === currentIndex
                      ? "w-2 h-2 bg-white"
                      : "w-1.5 h-1.5 bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <FaHeart
          onClick={clickOnLikedHandler}
          size={24}
          className={`absolute hover:scale-110 top-3 right-3 cursor-pointer ${isLiked ? "text-rose-500" : "text-secondary/80"} smooth`}
        />
      </div>
      <div className="p-3 flex flex-col gap-0.5">
        <div className="flex items-start justify-between gap-2">
          <Text variant="label-lg">{title}</Text>

          <div className="flex items-center gap-1 shrink-0 pt-0.5">
            <span className="font-semibold text-sm">5</span>
            <FaStar size={13} className="text-rose-500" />
          </div>
        </div>
        {shortDescription && (
          <Text variant="label-sm">{truncateText(shortDescription, 80)}</Text>
        )}
        <Text variant="label" color="textLight" className="font-semibold mt-1">
          Cena od <span className="text-primary">{price} Kč</span>
        </Text>
      </div>
    </Link>
  );
}
