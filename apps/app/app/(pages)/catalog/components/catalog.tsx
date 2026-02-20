"use client";

import React from "react";
import CatalogFilters from "./catalog-filters";
import Button from "@/app/components/ui/atoms/button";
import ListingCard from "@/app/components/ui/molecules/listing-card";

type Props = {};

const mockListings = [
  {
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    title: "Letní festival v Praze",
    price: "350",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    title: "Koncert pod širým nebem",
    price: "490",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    title: "Divadelní představení",
    price: "250",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=400&q=80",
    title: "Jazz večer v jazzklubu",
    price: "420",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=400&q=80",
    title: "Openair kino",
    price: "180",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1470229722913-7f419344ca51?auto=format&fit=crop&w=400&q=80",
    title: "Stand-up comedy show",
    price: "280",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1501612780289-11201ef255cb?auto=format&fit=crop&w=400&q=80",
    title: "Hudební festival",
    price: "650",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80",
    title: "Klasický koncert",
    price: "380",
  },
];

export default function Catalog({}: Props) {
  return (
    <div className="flex justify-center w-full px-6">
      <div className="flex w-full max-w-content items-start gap-6">
        <div className="w-100 shrink-0 pb-40 relative">
          <CatalogFilters />
        </div>
        <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] content-start gap-5">
          {mockListings.map((listing) => (
            <ListingCard
              key={listing.title}
              imageUrl={listing.imageUrl}
              title={listing.title}
              price={listing.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
