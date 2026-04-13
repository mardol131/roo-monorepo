export const collectionColors = {
  company: "company",
  companySurface: "companySurface",
  event: "event",
  eventSurface: "eventSurface",
  listing: "listing",
  listingSurface: "listingSurface",
  variant: "variant",
  variantSurface: "variantSurface",
  inquiry: "inquiry",
  inquirySurface: "inquirySurface",
};

export const colors = {
  primary: "primary",
  primarySurface: "primarySurface",
  onPrimary: "onPrimary",
  secondary: "secondary",
  onSecondary: "onSecondary",
  textDark: "textDark",
  textLight: "textLight",
  ...collectionColors,
};

export type Color = keyof typeof colors;

export type CollectionColor = keyof typeof collectionColors;
