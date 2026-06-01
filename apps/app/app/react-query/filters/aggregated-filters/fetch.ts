import {
  Activity,
  Amenity,
  Cuisine,
  DietaryOption,
  DishType,
  EntertainmentRule,
  EntertainmentType,
  EventType,
  FoodPreparationStyle,
  FoodServiceType,
  GastroRule,
  MusicGenre,
  Necessity,
  Personnel,
  PlaceType,
  RoomAmenity,
  Service,
  SpaceRule,
  SpaceType,
  Technology,
  VenueRule,
} from "@roo/common";

export type FilterOptions = {
  cuisines: Cuisine[];
  amenities: Amenity[];
  activities: Activity[];
  dietaryOptions: DietaryOption[];
  dishTypes: DishType[];
  entertainmentTypes: EntertainmentType[];
  eventTypes: EventType[];
  foodServiceTypes: FoodServiceType[];
  personnel: Personnel[];
  placeTypes: PlaceType[];
  services: Service[];
  technologies: Technology[];
  necessities: Necessity[];
  roomAmenities: RoomAmenity[];
  spaceRules: SpaceRule[];
  venueRules: VenueRule[];
  gastroRules: GastroRule[];
  entertainmentRules: EntertainmentRule[];
  musicGenres: MusicGenre[];
  spaceTypes: SpaceType[];
  foodPreparationStyles: FoodPreparationStyle[];
};

export async function fetchFilterOptions(): Promise<FilterOptions> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/filter-options`,
    { credentials: "include" },
  );
  if (!res.ok) throw new Error("Failed to fetch filter options");
  return res.json();
}
