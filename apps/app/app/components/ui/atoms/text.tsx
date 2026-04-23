import { Color } from "@/app/styles/colors";
import React, { JSX } from "react";

type TextVariant =
  | "display-2xl"
  | "display-xl"
  | "display-lg"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "body-lg"
  | "body"
  | "body-sm"
  | "label-lg"
  | "label"
  | "caption"
  | "quote";

interface TextProps {
  variant?: TextVariant;
  color?: Color;
  className?: string;
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

const variantClasses: Record<TextVariant, string> = {
  "display-2xl": "text-6xl font-bold tracking-tight",
  "display-xl":  "text-4xl font-bold tracking-tight",
  "display-lg":  "text-3xl font-semibold tracking-tight",
  h1:            "text-2xl font-bold",
  h2:            "text-xl font-semibold",
  h3:            "text-lg font-semibold",
  h4:            "text-base font-semibold",
  "body-lg":     "text-lg leading-relaxed",
  body:          "text-base leading-relaxed",
  "body-sm":     "text-sm leading-relaxed",
  "label-lg":    "text-sm font-medium",
  label:         "text-xs font-medium",
  caption:       "text-xs font-normal",
  quote:         "text-lg italic leading-relaxed",
};

const defaultElements: Record<TextVariant, keyof JSX.IntrinsicElements> = {
  "display-2xl": "h1",
  "display-xl":  "h1",
  "display-lg":  "h2",
  h1:            "h1",
  h2:            "h2",
  h3:            "h3",
  h4:            "h4",
  "body-lg":     "p",
  body:          "p",
  "body-sm":     "p",
  "label-lg":    "span",
  label:         "span",
  caption:       "span",
  quote:         "blockquote",
};

const getColorStyles = (color: Color): string => {
  const colorClasses: Record<Color, string> = {
    textDark: "text-text-dark",
    textLight: "text-text-light",
    primary: "text-primary",
    onPrimary: "text-on-primary",
    secondary: "text-secondary",
    primarySurface: "text-primary-surface",
    onSecondary: "text-on-secondary",
    calendarSurface: "text-calendar-surface",
    companySurface: "text-company-surface",
    event: "text-event",
    eventSurface: "text-event-surface",
    listingSurface: "text-listing-surface",
    company: "text-company",
    white: "text-white",
    listing: "text-listing",
    calendar: "text-calendar",
    inquiry: "text-inquiry",
    danger: "text-danger",
    dangerSurface: "text-danger-surface",
    warning: "text-warning",
    warningSurface: "text-warning-surface",
    variant: "text-variant",
    variantSurface: "text-variant-surface",
    inquirySurface: "text-inquiry-surface",
    space: "text-space",
    spaceSurface: "text-space-surface",
  };
  return colorClasses[color];
};

export default function Text({
  variant = "body",
  color = "textDark",
  className = "",
  children,
  as,
  ...props
}: TextProps) {
  const Element = as || defaultElements[variant] || "span";
  const classes = [variantClasses[variant], getColorStyles(color), className]
    .filter(Boolean)
    .join(" ");

  return (
    <Element className={classes} {...props}>
      {children}
    </Element>
  );
}
