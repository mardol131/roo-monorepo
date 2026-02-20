import React from "react";
import CardsSection, {
  mockListings,
} from "../homepage/components/cards-section";
import CatalogFilters from "./components/catalog-filters";
import Button from "@/app/components/ui/atoms/button";
import ListingCard from "@/app/components/ui/molecules/listing-card";
import Catalog from "./components/catalog";

type Props = {};

export default function page({}: Props) {
  return <Catalog />;
}
