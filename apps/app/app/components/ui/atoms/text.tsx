import React, { JSX } from "react";

type TextVariant =
  | "heading1"
  | "heading2"
  | "heading3"
  | "heading4"
  | "heading5"
  | "subheading"
  | "body1"
  | "body2"
  | "body3"
  | "label1"
  | "label2"
  | "label3"
  | "label4";

type TextColor = "dark" | "light" | "primary" | "secondary";

interface TextProps {
  variant?: TextVariant;
  color?: TextColor;
  className?: string;
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

const getVariantStyles = (variant: TextVariant): string => {
  const variantClasses: Record<TextVariant, string> = {
    // Headings
    heading1: "text-4xl font-bold leading-tight md:text-5xl lg:text-6xl",
    heading2: "text-3xl font-bold leading-tight md:text-4xl lg:text-5xl",
    heading3: "text-2xl font-bold leading-tight md:text-3xl lg:text-4xl",
    heading4: "text-xl font-bold leading-tight md:text-2xl",
    heading5: "text-lg font-bold leading-tight md:text-xl",
    subheading: "text-lg font-medium leading-relaxed text-zinc-600",

    // Body text
    body1: "text-base leading-relaxed",
    body2: "text-sm leading-relaxed",
    body3: "text-xs leading-relaxed",

    // Labels
    label1: "text-sm font-medium",
    label2: "text-xs font-medium",
    label3: "text-xs font-semibold uppercase tracking-wider",
    label4: "text-xs font-normal",
  };
  return variantClasses[variant];
};

const getColorStyles = (color: TextColor): string => {
  const colorClasses: Record<TextColor, string> = {
    dark: "text-zinc-900",
    light: "text-zinc-200",
    primary: "text-rose-500",
    secondary: "text-zinc-900",
  };
  return colorClasses[color];
};

const getDefaultElement = (
  variant: TextVariant,
): keyof JSX.IntrinsicElements => {
  if (variant.startsWith("heading1")) return "h1";
  if (variant.startsWith("heading2")) return "h2";
  if (variant.startsWith("heading3")) return "h3";
  if (variant.startsWith("heading4")) return "h4";
  if (variant.startsWith("heading5")) return "h5";
  if (variant === "subheading") return "p";
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
