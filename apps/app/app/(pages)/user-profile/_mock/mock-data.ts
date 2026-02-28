import { Event, EventStatus, Inquiry, InquiryChatMessage } from "@roo/common";
import { Calendar, Heart, MessageSquare, TrendingUp } from "lucide-react";

// ── Inquiries ──────────────────────────────────────────────────────────────────

export function getInquiries(): Inquiry[] {
  return [
    {
      id: "inq-1",
      status: "pending",
      sentAt: "10. 2. 2025",
      supplier: {
        id: "sup-1",
        name: "DJ Services Praha",
        category: "Hudba & zábava",
        rating: 4.8,
        reviewCount: 124,
        location: "Praha",
        slug: "dj-services-praha",
      },
      event: { id: "1", name: "Firemní večírek 2025", date: "15. 3. 2025" },
      offer: {
        title: "DJ Premium Balíček",
        description:
          "Profesionální DJ s vlastní ozvučovací technikou, světelnou show a moderováním.",
        price: 8500,
        duration: "za celou akci",
        includes: [
          "Ozvučovací technika",
          "Světelná show",
          "Moderování večera",
          "Příprava playlistu",
        ],
        excludes: ["Doprava nad 30 km"],
      },
    },
    {
      id: "inq-2",
      status: "confirmed",
      sentAt: "8. 2. 2025",
      supplier: {
        id: "sup-2",
        name: "Catering Premium",
        category: "Catering",
        rating: 4.9,
        reviewCount: 87,
        location: "Praha",
        slug: "catering-premium",
      },
      event: { id: "1", name: "Firemní večírek 2025", date: "15. 3. 2025" },
      offer: {
        title: "Firemní catering",
        description: "Kompletní catering pro firemní akce včetně obsluhy.",
        price: 42000,
        duration: "za celou akci",
        includes: ["Teplá i studená jídla", "Obsluha", "Příbory a nádobí"],
        excludes: ["Alkoholické nápoje"],
      },
    },
    {
      id: "inq-3",
      status: "pending",
      sentAt: "12. 2. 2025",
      supplier: {
        id: "sup-3",
        name: "Foto & Video Studio",
        category: "Fotografie & video",
        rating: 4.7,
        reviewCount: 56,
        location: "Praha",
        slug: "foto-video-studio",
      },
      event: { id: "1", name: "Firemní večírek 2025", date: "15. 3. 2025" },
      offer: {
        title: "Foto + video balíček",
        description: "Profesionální fotograf a kameraman po celou dobu akce.",
        price: 12000,
        duration: "za celou akci",
        includes: ["Fotograf", "Kameraman", "Editace do 14 dní"],
        excludes: ["Tisk fotografií"],
      },
    },
    {
      id: "inq-4",
      status: "declined",
      sentAt: "5. 2. 2025",
      supplier: {
        id: "sup-4",
        name: "Květinová výzdoba Novák",
        category: "Dekorace",
        rating: 4.5,
        reviewCount: 32,
        location: "Praha",
        slug: "kvetinova-vyzdoba-novak",
      },
      event: { id: "1", name: "Firemní večírek 2025", date: "15. 3. 2025" },
      offer: {
        title: "Firemní dekorace",
        description: "Kompletní květinová výzdoba prostoru.",
        price: 6200,
        duration: "za celou akci",
        includes: ["Stolní dekorace", "Vstupní výzdoba"],
        excludes: ["Odvoz po akci"],
      },
    },
    {
      id: "inq-5",
      status: "pending",
      sentAt: "18. 3. 2025",
      supplier: {
        id: "sup-5",
        name: "Magic Show & Entertainment",
        category: "Zábava",
        rating: 4.6,
        reviewCount: 41,
        location: "Brno",
        slug: "magic-show-entertainment",
      },
      event: { id: "2", name: "Narozeninová oslava", date: "2. 5. 2025" },
      offer: {
        title: "Magic show 60 min",
        description: "Interaktivní kouzelnická show pro hosty všech věků.",
        price: 15000,
        duration: "60 minut",
        includes: ["Kouzelnická show", "Interaktivní část s hosty"],
        excludes: ["Cestovné nad 50 km"],
      },
    },
    {
      id: "inq-6",
      status: "confirmed",
      sentAt: "15. 3. 2025",
      supplier: {
        id: "sup-6",
        name: "Sound & Light Pro",
        category: "Technika",
        rating: 4.8,
        reviewCount: 63,
        location: "Brno",
        slug: "sound-light-pro",
      },
      event: { id: "2", name: "Narozeninová oslava", date: "2. 5. 2025" },
      offer: {
        title: "Ozvučení + světla",
        description: "Profesionální ozvučovací a světelná technika.",
        price: 9800,
        duration: "za celou akci",
        includes: ["PA systém", "Světelná show", "Technik na místě"],
        excludes: [],
      },
    },
  ];
}

export function getInquiry(_eventId: string, _contractorId: string): Inquiry {
  return {
    id: "inq-1",
    status: "pending",
    sentAt: "10. 2. 2025",
    supplier: {
      id: "sup-1",
      name: "DJ Services Praha",
      category: "Hudba & zábava",
      rating: 4.8,
      reviewCount: 124,
      location: "Praha",
      slug: "dj-services-praha",
    },
    event: {
      id: _eventId,
      name: "Firemní večírek 2025",
      date: "15. 3. 2025",
    },
    offer: {
      title: "DJ Premium Balíček",
      description:
        "Profesionální DJ s vlastní ozvučovací technikou, světelnou show a moderováním. Vhodné pro firemní akce a večírky.",
      price: 8500,
      duration: "za celou akci",
      includes: [
        "Ozvučovací technika",
        "Světelná show",
        "Moderování večera",
        "Příprava playlistu",
      ],
      excludes: ["Doprava nad 30 km"],
    },
  };
}

export function getMessages(_inquiryId: string): InquiryChatMessage[] {
  return [
    {
      id: "m1",
      sender: "user",
      content:
        "Dobrý den, mám zájem o váš Premium balíček na firemní večírek 15. 3. Bude přítomno cca 80 hostů. Jste dostupní?",
      timestamp: new Date(),
    },
    {
      id: "m2",
      sender: "supplier",
      content:
        "Dobrý den, děkuji za zájem! Termín 15. 3. mám zatím volný. Mohu se zeptat, od kolika hodin by akce probíhala a jaký žánr hudby preferujete?",
      timestamp: new Date(),
    },
    {
      id: "m3",
      sender: "user",
      content:
        "Akce začíná v 18:00 a končí ve 23:00. Preferujeme mix pop/house, nic extrémního. Místo konání je centrum Prahy.",
      timestamp: new Date(),
    },
  ];
}

// ── Event ──────────────────────────────────────────────────────────────────────

export const MOCK_EVENT: Event = {
  id: "1",
  status: "active",
  data: {
    name: "Firemní večírek 2025",
    icon: "PartyPopper",
    date: {
      start: new Date("2025-03-15T18:00:00"),
      end: new Date("2025-03-15T23:00:00"),
    },
    location: {
      id: "loc-1",
      name: "Praha",
    },
    guests: { adults: 80, children: 0, ztp: false, pets: false },
  },
};

export const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    status: "active",
    data: {
      name: "Firemní večírek 2025",
      icon: "PartyPopper",
      date: {
        start: new Date("2025-03-15T18:00:00"),
        end: new Date("2025-03-15T23:00:00"),
      },
      location: { id: "loc-1", name: "Praha" },
      guests: { adults: 80, children: 0, ztp: false, pets: false },
    },
  },
  {
    id: "2",
    status: "planned",
    data: {
      name: "Narozeninová oslava",
      icon: "Cake",
      date: {
        start: new Date("2025-05-02T16:00:00"),
        end: new Date("2025-05-02T22:00:00"),
      },
      location: { id: "loc-2", name: "Brno" },
      guests: { adults: 28, children: 2, ztp: false, pets: false },
    },
  },
  {
    id: "3",
    status: "planned",
    data: {
      name: "Teambuilding Q2",
      icon: "Briefcase",
      date: {
        start: new Date("2025-06-20T09:00:00"),
        end: new Date("2025-06-21T17:00:00"),
      },
      location: { id: "loc-3", name: "Liberec" },
      guests: { adults: 50, children: 0, ztp: false, pets: false },
    },
  },
  {
    id: "4",
    status: "completed",
    data: {
      name: "Promoce Jana",
      icon: "GraduationCap",
      date: {
        start: new Date("2025-01-10T14:00:00"),
        end: new Date("2025-01-10T20:00:00"),
      },
      location: { id: "loc-1", name: "Praha" },
      guests: { adults: 25, children: 0, ztp: false, pets: false },
    },
  },
];

// STATS homepage

export const STATS = [
  {
    label: "Aktivní události",
    value: "3",
    icon: Calendar,
    color: "bg-blue-50 text-blue-500",
  },
  {
    label: "Poptávky",
    value: "12",
    icon: MessageSquare,
    color: "bg-rose-50 text-rose-500",
  },
  {
    label: "Oblíbené",
    value: "8",
    icon: Heart,
    color: "bg-pink-50 text-pink-500",
  },
  {
    label: "Celkem akcí",
    value: "24",
    icon: TrendingUp,
    color: "bg-emerald-50 text-emerald-500",
  },
];
