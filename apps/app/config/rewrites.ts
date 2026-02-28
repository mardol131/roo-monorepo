export const rewrites = [
  {
    source: "/",
    destination: "/homepage",
  },
  {
    source: "/katalog/:type",
    destination: "/catalog/:type",
  },
  {
    source: "/katalog",
    destination: "/catalog",
  },
  {
    source: "/inzerat/:id",
    destination: "/listing/:id",
  },
  {
    source: "/inzerat/:id/poptavka",
    destination: "/listing/:id/booking",
  },
  {
    source: "/ucet",
    destination: "/user-profile",
  },
  {
    source: "/ucet/moje-udalosti",
    destination: "/user-profile/my-events",
  },
  {
    source: "/ucet/moje-udalosti/:id",
    destination: "/user-profile/my-events/:id",
  },
  {
    source: "/ucet/moje-udalosti/:id/:contractorId",
    destination: "/user-profile/my-events/:id/:contractorId",
  },
];
