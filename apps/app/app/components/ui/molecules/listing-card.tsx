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
import { Listing } from "@roo/common";
import {
  Users,
  Maximize2,
  MapPin,
  BedDouble,
  Car,
  Wine,
  Baby,
  Clock,
} from "lucide-react";

type Details = Listing["details"][number];

type Props = {
  imageUrl: string;
  id: string;
  title: string;
  price: number;
  imageAlt?: string;
  details?: Details;
};

const AUDIENCE_LABEL: Record<string, string> = {
  adults: "Dospělí",
  kids: "Děti",
  seniors: "Senioři",
};

function getCityName(city: unknown): string | null {
  if (!city) return null;
  if (typeof city === "string") return city;
  if (Array.isArray(city)) {
    const first = city[0];
    if (!first) return null;
    return typeof first === "string" ? first : (first as { name: string }).name;
  }
  return (city as { name: string }).name ?? null;
}

function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1 bg-zinc-100 rounded-md px-1.5 py-0.5">
      <span className="text-zinc-400">{icon}</span>
      <Text variant="caption" color="textLight">
        {label}
      </Text>
    </div>
  );
}

function DetailsChips({ details }: { details: Details }) {
  const chips: React.ReactNode[] = [];
  const iconSize = 11;

  if (details.blockType === "venue") {
    const city = getCityName(details.location.city);
    if (city)
      chips.push(
        <Chip key="city" icon={<MapPin size={iconSize} />} label={city} />,
      );
    chips.push(
      <Chip
        key="cap"
        icon={<Users size={iconSize} />}
        label={`${details.capacity} hostů`}
      />,
    );
    chips.push(
      <Chip
        key="area"
        icon={<Maximize2 size={iconSize} />}
        label={`${details.area} m²`}
      />,
    );
    if (details.hasAccommodation)
      chips.push(
        <Chip
          key="acc"
          icon={<BedDouble size={iconSize} />}
          label="Ubytování"
        />,
      );
    if (details.parking?.hasParking)
      chips.push(
        <Chip key="park" icon={<Car size={iconSize} />} label="Parkování" />,
      );
  }

  if (details.blockType === "gastro") {
    const city = getCityName(details.location.city);
    if (city)
      chips.push(
        <Chip key="city" icon={<MapPin size={iconSize} />} label={city} />,
      );
    chips.push(
      <Chip
        key="cap"
        icon={<Users size={iconSize} />}
        label={`${details.capacity} hostů`}
      />,
    );
    if (details.hasAlcoholLicense)
      chips.push(
        <Chip key="alc" icon={<Wine size={iconSize} />} label="Alkohol" />,
      );
    if (details.kidsMenu)
      chips.push(
        <Chip key="kids" icon={<Baby size={iconSize} />} label="Dětské menu" />,
      );
  }

  if (details.blockType === "entertainment") {
    chips.push(
      <Chip
        key="cap"
        icon={<Users size={iconSize} />}
        label={`${details.capacity} hostů`}
      />,
    );
    if (details.audience?.length) {
      const label = details.audience
        .map((a) => AUDIENCE_LABEL[a] ?? a)
        .join(", ");
      chips.push(
        <Chip key="aud" icon={<Users size={iconSize} />} label={label} />,
      );
    }
    if (details.setupAndTearDownRules?.setupTime) {
      chips.push(
        <Chip
          key="setup"
          icon={<Clock size={iconSize} />}
          label={`Instalace ${details.setupAndTearDownRules.setupTime} min`}
        />,
      );
    }
  }

  if (chips.length === 0) return null;
  return <div className="flex flex-wrap gap-1 mt-1">{chips}</div>;
}

export default function ListingCard({
  imageUrl,
  title,
  price,
  imageAlt,
  id,
  details,
}: Props) {
  const { isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(false);

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

  return (
    <Link
      href={{ pathname: "/listing/[listingId]", params: { listingId: id } }}
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
        {details && <DetailsChips details={details} />}
        <Text variant="label" color="textLight" className="font-semibold mt-1">
          Cena od <span className="text-primary">{price} Kč</span>
        </Text>
      </div>
    </Link>
  );
}
