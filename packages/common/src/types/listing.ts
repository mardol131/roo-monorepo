export type Listing = {
  id: string;
  name: string;
  description?: string;
  city: { id: string; label: string };
  priceFrom?: number;
  priceDuration?: string;
  variantsCount?: number;
  rating?: number;
  reviewsCount?: number;
};

export interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  includes: string[];
  excludes: string[];
  idealFor: string[];
  images: string[];
  availableDate?: string;
}
