export type InquiryStatus = "pending" | "confirmed" | "declined";

export type Inquiry = {
  id: string;
  status: InquiryStatus;
  sentAt: string;
  supplier: {
    id: string;
    name: string;
    category: string;
    rating: number;
    reviewCount: number;
    location: string;
    slug: string;
  };
  event: {
    id: string;
    name: string;
    date: string;
  };
  offer: {
    title: string;
    description: string;
    price: number;
    duration: string;
    includes: string[];
    excludes: string[];
  };
};

export type InquiryChatMessage = {
  id: string;
  sender: "user" | "supplier";
  content: string;
  timestamp: Date;
};
