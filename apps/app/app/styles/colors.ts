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
  space: "space",
  spaceSurface: "spaceSurface",
};

export const colors = {
  primary: "primary",
  primarySurface: "primarySurface",
  onPrimary: "onPrimary",
  secondary: "secondary",
  onSecondary: "onSecondary",
  textDark: "textDark",
  textLight: "textLight",
  calendar: "calendar",
  calendarSurface: "calendarSurface",
  white: "white",
  danger: "danger",
  dangerSurface: "dangerSurface",
  warning: "warning",
  warningSurface: "warningSurface",
  success: "success",
  successSurface: "successSurface",
  ...collectionColors,
};

export type Color = keyof typeof colors;

export type CollectionColor = keyof typeof collectionColors;
