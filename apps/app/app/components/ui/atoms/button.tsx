import { IntlLink, Link } from "@/app/i18n/navigation";
import * as lucideIcons from "lucide-react";

type ButtonVersion =
  | "primary"
  | "primarySoft"
  | "secondary"
  | "plain"
  | "outlined"
  | "company"
  | "companyFull"
  | "event"
  | "eventFull"
  | "link"
  | "listing"
  | "listingFull"
  | "variant"
  | "variantFull"
  | "inquiry"
  | "inquiryFull"
  | "none"
  | "white";
type ButtonSize = "2xl" | "xl" | "lg" | "md" | "sm";
type ButtonRounding = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";

type LucideIcons = keyof typeof lucideIcons;

const getRoundingClass = (rounding: ButtonRounding): string => {
  const roundingClasses: Record<ButtonRounding, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  };
  return roundingClasses[rounding];
};

export interface ButtonProps {
  version?: ButtonVersion;
  text: string;
  size?: ButtonSize;
  rounding?: ButtonRounding;
  onClick?: () => void;
  link?: IntlLink;
  className?: string;
  iconLeft?: LucideIcons;
  iconRight?: LucideIcons;
  disabled?: boolean;
  htmlType?: HTMLButtonElement["type"];
  ownColor?: string;
}

const getVersionClass = (
  version: ButtonVersion,
  disabled?: boolean,
  ownColor?: string,
): string => {
  const versionClasses: Record<ButtonVersion, string> = {
    primary: "bg-primary text-white shadow hover:shadow-md",
    primarySoft:
      "bg-primary-surface text-primary hover:bg-primary-surface hover:bg-opacity-90",
    secondary: "bg-zinc-900 text-white shadow hover:shadow-md",
    plain: "bg-transparent text-zinc-900",
    company:
      "bg-company-surface text-company hover:bg-company-surface hover:bg-opacity-90",
    companyFull: "bg-company text-white shadow hover:shadow-md",
    event:
      "bg-event-surface text-event hover:bg-event-surface hover:bg-opacity-90",
    eventFull: "bg-event text-white shadow hover:shadow-md",
    listing: "bg-listing-surface text-listing hover:bg-listing-surface",
    listingFull: "bg-listing text-white",
    variant: "bg-variant-surface text-variant hover:bg-variant-surface",
    variantFull: "bg-variant text-white",
    inquiry: "bg-inquiry-surface text-inquiry hover:bg-inquiry-surface",
    inquiryFull: "bg-inquiry text-white",
    outlined:
      "bg-transparent text-zinc-900 border border-zinc-900 hover:bg-black/5",
    link: "bg-transparent text-rose-500 underline hover:opacity-80 active:opacity-60 transition-opacity p-0",
    white: "bg-white text-dark shadow hover:shadow-md",
    none: ownColor || "",
  };
  return versionClasses[version];
};

const getSizeClass = (size: ButtonSize): string => {
  const sizeClasses: Record<ButtonSize, string> = {
    "2xl": "px-8 py-4 text-2xl",
    xl: "px-7 py-3.5 text-xl",
    lg: "px-6 py-3 text-lg",
    md: "px-4 py-2 text-base",
    sm: "px-3 py-1.5 text-sm",
  };
  return sizeClasses[size];
};

const getIconSize = (size: ButtonSize): string => {
  const iconSizes: Record<ButtonSize, string> = {
    "2xl": "w-8 h-8",
    xl: "w-6 h-6",
    lg: "w-5 h-5",
    md: "w-4 h-4",
    sm: "w-3.5 h-3.5",
  };
  return iconSizes[size];
};

export default function Button({
  version = "primary",
  text,
  size = "md",
  rounding = "full",
  onClick,
  link,
  className,
  iconLeft,
  iconRight,
  disabled,
  htmlType = "button",
  ownColor,
}: ButtonProps) {
  const baseClasses = `${!disabled ? "cursor-pointer" : ""} inline-flex items-center ${getRoundingClass(rounding)} justify-center font-medium transition-all ease-in-out ${disabled ? "opacity-50" : "hover:scale-105"} gap-2`;
  const versionClass = getVersionClass(version, disabled, ownColor);
  const sizeClass = getSizeClass(size);
  const iconSize = getIconSize(size);
  const buttonClass =
    `${baseClasses} ${versionClass} ${version !== "link" ? sizeClass : ""} ${className || ""}`.trim();

  const LeftIcon = iconLeft
    ? (lucideIcons[iconLeft] as React.ComponentType<{ className?: string }>)
    : null;
  const RightIcon = iconRight
    ? (lucideIcons[iconRight] as React.ComponentType<{ className?: string }>)
    : null;

  const buttonContent = (
    <>
      {LeftIcon && <LeftIcon className={iconSize} />}
      {text}
      {RightIcon && <RightIcon className={iconSize} />}
    </>
  );

  if (link) {
    return (
      <Link href={link} className={buttonClass}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      type={htmlType}
      disabled={disabled}
    >
      {buttonContent}
    </button>
  );
}
