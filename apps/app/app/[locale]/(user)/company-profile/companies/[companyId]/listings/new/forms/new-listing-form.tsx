"use client";

import { z } from "zod";
import EntertainmentListingForm from "./entertainment-listing-form";
import GastroListingForm from "./gastro-listing-form";
import VenueListingForm from "./venue-listing-form";
import { Listing } from "@roo/common";

// ── Switcher ───────────────────────────────────────────────────────────────────

type Props = {
  type: Listing["details"][0]["blockType"];
  onCancel: () => void;
};

export default function NewListingForm({ type, onCancel }: Props) {
  if (type === "venue") return <VenueListingForm onCancel={onCancel} />;
  if (type === "gastro") return <GastroListingForm onCancel={onCancel} />;
  return <EntertainmentListingForm onCancel={onCancel} />;
}
