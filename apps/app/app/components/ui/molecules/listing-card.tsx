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

type Props = {
  imageUrl: string;
  id: string;
  title: string;
  price: number;
  imageAlt?: string;
};

export default function ListingCard({
  imageUrl,
  title,
  price,
  imageAlt,
  id,
}: Props) {
  const [isLiked, setIsLiked] = useState(false);
  const { mutate: createFavouriteListing } = useCreateFavouriteListing();
  const { mutate: removeFavouriteListing } = useDeleteFavouriteListing();
  const { data: favouriteListings } = useFavouriteListings();
  const auth = useAuth();

  const clickOnLikedHandler = useCallback(
    (e: React.MouseEvent<SVGAElement | SVGElement, MouseEvent>) => {
      e.stopPropagation();
      e.preventDefault();

      if (!auth.isAuthenticated) {
        setIsLiked((prev) => {
          const current = storage.read("favouriteListings") ?? [];
          if (prev) {
            storage.write(
              "favouriteListings",
              current.filter((listingId) => listingId !== id),
            );
          } else {
            storage.write("favouriteListings", [...current, id]);
          }
          return !prev;
        });
        return;
      }

      setIsLiked((prev) => {
        if (prev) {
          const record = favouriteListings?.docs?.find((f) =>
            typeof f.listing === "string"
              ? f.listing === id
              : f.listing.id === id,
          );
          if (record) removeFavouriteListing(record.id);
        } else {
          createFavouriteListing({ listing: id, user: auth?.user?.id || "" });
        }
        return !prev;
      });
    },
    [
      auth.isAuthenticated,
      id,
      favouriteListings,
      createFavouriteListing,
      removeFavouriteListing,
    ],
  );

  useEffect(() => {
    if (auth.isAuthenticated) {
      const isFavourite = favouriteListings?.docs?.some((f) =>
        typeof f.listing === "string" ? f.listing === id : f.listing.id === id,
      );
      setIsLiked(Boolean(isFavourite));
    } else {
      const local = storage.read("favouriteListings") ?? [];
      setIsLiked(local.includes(id));
    }
  }, [auth.isAuthenticated, favouriteListings, id]);

  return (
    <Link
      href={{
        pathname: "/listing/[listingId]",
        params: { listingId: id },
      }}
      target="_blank"
      className="group rounded-xl transition ease-in-out"
    >
      <div className="relative min-w-60 w-full rounded-xl aspect-square bg-zinc-100 overflow-hidden">
        {imageUrl && imageUrl.startsWith("http") && (
          <Image
            src={imageUrl}
            alt={imageAlt || title}
            className="object-cover w-full h-full object-center transition-transform duration-300 group-hover:scale-105"
            width={1000}
            height={1000}
          />
        )}
        <FaHeart
          onClick={clickOnLikedHandler}
          size={24}
          className={`absolute hover:scale-110 top-3 right-3 text-primary cursor-pointer ${isLiked ? "text-rose-500" : "text-secondary/80"} smooth`}
        />
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="p-3 flex flex-col gap-1">
          <Text variant="label-lg" className="">
            {title}
          </Text>
          <Text variant="body-sm" color="textLight" className="font-semibold">
            Cena začíná od <span className="text-primary">{price} Kč</span>
          </Text>
        </div>
        <div className="p-3 flex items-center gap-1">
          <span className="font-semibold">5</span>{" "}
          <FaStar size={16} className="text-rose-500" />
        </div>
      </div>
    </Link>
  );
}
