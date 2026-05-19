import {
  Activity,
  Amenity,
  Cuisine,
  DietaryOption,
  DishType,
  EntertainmentType,
  EventType,
  FoodServiceStyle,
  Necessity,
  Personnel,
  PlaceType,
  RoomAmenity,
  Rule,
  Service,
  SpaceType,
  Technology,
} from "@roo/common";

export type FilterOptions = {
  cuisines: Cuisine[];
  amenities: Amenity[];
  activities: Activity[];
  dietaryOptions: DietaryOption[];
  dishTypes: DishType[];
  entertainmentTypes: EntertainmentType[];
  eventTypes: EventType[];
  foodServiceStyles: FoodServiceStyle[];
  personnel: Personnel[];
  placeTypes: PlaceType[];
  services: Service[];
  technologies: Technology[];
  necessities: Necessity[];
  roomAmenities: RoomAmenity[];
  rules: Rule[];
  spaceTypes: SpaceType[];
};

export async function fetchFilterOptions(): Promise<FilterOptions> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/filter-options`,
    { credentials: "include" },
  );
  if (!res.ok) throw new Error("Failed to fetch filter options");
  return res.json();
}
