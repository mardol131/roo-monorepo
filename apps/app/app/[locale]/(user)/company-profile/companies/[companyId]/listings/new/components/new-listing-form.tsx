"use client";

import { z } from "zod";
import EntertainmentListingForm from "./entertainment-listing-form";
import GastroListingForm from "./gastro-listing-form";
import VenueListingForm, { VenueFormInputs } from "./venue-listing-form";

export type { VenueFormInputs as FormInputs };

export type ListingType = "venue" | "gastro" | "entertainment";

// ── Combined type (kept for page.tsx + spaces components compatibility) ────────

const optionalPositiveNumber = z.preprocess(
  (val) => (val === "" || val === undefined || val === null ? undefined : val),
  z.coerce.number().positive().optional(),
);

const roomSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  capacity: optionalPositiveNumber,
  area: optionalPositiveNumber,
});

const buildingSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  capacity: optionalPositiveNumber,
  area: optionalPositiveNumber,
  hasRooms: z.boolean().default(false),
  rooms: z.array(roomSchema).default([]),
});

const baseSchema = z.object({
  name: z.string(),
  images: z.object({
    coverImage: z.string(),
    logo: z.string().optional(),
    gallery: z.array(z.string()).default([]),
  }),
  price: z.object({ startsAt: z.number() }),
  location: z.object({
    address: z.string().optional(),
    city: z.string().optional(),
    districts: z.array(z.string()).default([]),
    regions: z.array(z.string()).default([]),
    cities: z.array(z.string()).default([]),
  }),
  capacity: z.number(),
  minimumCapacity: optionalPositiveNumber,
  area: optionalPositiveNumber,
  spaceType: z.enum(["area", "building", "room"]).optional(),
  areaName: z.string().optional(),
  areaDescription: z.string().optional(),
  areaCapacity: optionalPositiveNumber,
  areaArea: optionalPositiveNumber,
  hasBuildings: z.boolean().default(false),
  buildings: z.array(buildingSchema).default([]),
  buildingName: z.string().optional(),
  buildingDescription: z.string().optional(),
  buildingCapacity: optionalPositiveNumber,
  buildingArea: optionalPositiveNumber,
  buildingHasRooms: z.boolean().default(false),
  buildingRooms: z.array(roomSchema).default([]),
  rooms: z.array(roomSchema).default([]),
  cuisines: z.array(z.string()).default([]),
  dishTypes: z.array(z.string()).default([]),
  dietaryOptions: z.array(z.string()).default([]),
  foodServiceStyles: z.array(z.string()).default([]),
  hasAlcoholLicense: z.boolean().default(false),
  kidsMenu: z.boolean().default(false),
  necessities: z.array(z.string()).default([]),
  entertainmentTypes: z.array(z.string()).default([]),
  audience: z.array(z.enum(["adults", "kids", "seniors"])).default([]),
  setupTime: optionalPositiveNumber,
  tearDownTime: optionalPositiveNumber,
});

export type NewListingFormInputs = z.infer<typeof baseSchema>;

// ── Switcher ───────────────────────────────────────────────────────────────────

type Props = {
  type: ListingType;
  onCancel: () => void;
};

export default function NewListingForm({ type, onCancel }: Props) {
  if (type === "venue") return <VenueListingForm onCancel={onCancel} />;
  if (type === "gastro") return <GastroListingForm onCancel={onCancel} />;
  return <EntertainmentListingForm onCancel={onCancel} />;
}
