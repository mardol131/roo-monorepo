export type InquiryStatus = "pending" | "confirmed" | "declined";

export type Inquiry = {
  id: string;
  status: InquiryStatus;
  sentAt: string;
  lastCompanyMessageSentAt?: Date;
  lastUserMessageSentAt?: Date;
  lastUserSeenAt?: Date;
  lastCompanySeenAt?: Date;
  company: {
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
  variant: {
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
  sender: "user" | "company";
  content: string;
  timestamp: Date;
};
