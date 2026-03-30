export type Company = {
  id: string;
  name: string;
  ico: string;
  description?: string;
  email: string;
  phone?: string;
  website?: string;
  city: { id: string; label: string };
};
