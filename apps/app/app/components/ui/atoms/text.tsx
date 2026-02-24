import React, { JSX } from "react";

type TextVariant =
  | "title1"
  | "title2"
  | "title3"
  | "heading1"
  | "heading2"
  | "heading3"
  | "heading4"
  | "heading5"
  | "subheading0"
  | "subheading1"
  | "subheading2"
  | "body1"
  | "body2"
  | "body3"
  | "body4"
  | "body5"
  | "label1"
  | "label2"
  | "label3"
  | "label4";

type TextColor =
  | "dark"
  | "light"
  | "primary"
  | "onPrimary"
  | "secondary"
  | "white";

interface TextProps {
  variant?: TextVariant;
  color?: TextColor;
  className?: string;
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

const getVariantStyles = (variant: TextVariant): string => {
  const variantClasses: Record<TextVariant, string> = {
    // Titles - extra large
    title1: "text-7xl font-bold leading-tight md:text-8xl lg:text-9xl",
    title2: "text-6xl font-bold leading-tight md:text-7xl lg:text-8xl",
    title3: "text-5xl font-bold leading-tight md:text-6xl lg:text-7xl",

    // Headings
    heading1: "text-4xl font-bold leading-tight md:text-5xl lg:text-6xl",
    heading2: "text-3xl font-bold leading-tight md:text-4xl lg:text-5xl",
    heading3: "text-2xl font-bold leading-tight md:text-3xl lg:text-4xl",
    heading4: "text-xl font-bold leading-tight md:text-2xl",
    heading5: "text-lg font-bold leading-tight md:text-xl",

    // Subheadings
    subheading0: "text-2xl font-medium leading-relaxed",
    subheading1: "text-xl font-medium leading-relaxed",
    subheading2: "text-lg font-medium leading-relaxed",

    // Body text
    body1: "text-2xl leading-relaxed",
    body2: "text-xl leading-relaxed",
    body3: "text-lg leading-relaxed",
    body4: "text-base leading-relaxed",
    body5: "text-sm leading-relaxed",

    // Labels
    label1: "text-sm font-medium",
    label2: "text-xs font-medium",
    label3: "text-xs font-medium",
    label4: "text-xs font-normal",
  };
  return variantClasses[variant];
};

const getColorStyles = (color: TextColor): string => {
  const colorClasses: Record<TextColor, string> = {
    dark: "text-textDark",
    light: "text-textLight",
    primary: "text-primary",
    onPrimary: "text-onPrimary",
    secondary: "text-secondary",
    white: "text-white",
  };
  return colorClasses[color];
};

const getDefaultElement = (
  variant: TextVariant,
): keyof JSX.IntrinsicElements => {
  if (variant === "title1") return "h1";
  if (variant === "title2") return "h2";
  if (variant === "title3") return "h3";
  if (variant.startsWith("heading1")) return "h1";
  if (variant.startsWith("heading2")) return "h2";
  if (variant.startsWith("heading3")) return "h3";
  if (variant.startsWith("heading4")) return "h4";
  if (variant.startsWith("heading5")) return "h5";
  if (variant.startsWith("subheading")) return "p";
  if (variant.startsWith("body")) return "p";
  return "span";
};

export default function Text({
  variant = "body1",
  color = "dark",
  className = "",
  children,
  as,
  ...props
}: TextProps) {
  const Element = as || getDefaultElement(variant);
  const variantClasses = getVariantStyles(variant);
  const colorClasses = getColorStyles(color);
  const textClasses = `${variantClasses} ${colorClasses} ${className}`.trim();

  return (
    <Element className={textClasses} {...props}>
      {children}
    </Element>
  );
}
