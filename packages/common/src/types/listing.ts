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
