import * as lucideIcons from "lucide-react";

type ButtonVersion =
  | "primary"
  | "secondary"
  | "plain"
  | "outlined"
  | "link"
  | "white";
type ButtonSize = "2xl" | "xl" | "lg" | "md" | "sm";

type LucideIcons = keyof typeof lucideIcons;

interface ButtonProps {
  version?: ButtonVersion;
  text: string;
  size?: ButtonSize;
  onClick?: () => void;
  link?: string;
  className?: string;
  iconLeft?: LucideIcons;
  iconRight?: LucideIcons;
  disabled?: boolean;
}

const getVersionClass = (
  version: ButtonVersion,
  disabled?: boolean,
): string => {
  const versionClasses: Record<ButtonVersion, string> = {
    primary: "bg-rose-500 text-white shadow hover:shadow-md",
    secondary: "bg-zinc-900 text-white shadow hover:shadow-md",
    plain: "bg-transparent text-zinc-900",
    outlined:
      "bg-transparent text-zinc-900 border border-zinc-900 hover:bg-black/5",
    link: "bg-transparent text-rose-500 underline hover:opacity-80 active:opacity-60 transition-opacity p-0",
    white: "bg-white text-dark shadow hover:shadow-md",
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
  onClick,
  link,
  className,
  iconLeft,
  iconRight,
  disabled,
}: ButtonProps) {
  const baseClasses = `cursor-pointer inline-flex items-center rounded-full justify-center font-medium rounded transition-all ease-in-out  ${disabled ? "" : "hover:scale-105"} gap-2`;
  const versionClass = getVersionClass(version);
  const sizeClass = getSizeClass(size);
  const iconSize = getIconSize(size);
  const buttonClass =
    `${baseClasses} ${versionClass} ${version !== "link" ? sizeClass : ""} ${className || ""}`.trim();

  const LeftIcon = iconLeft
    ? (lucideIcons[
        iconLeft as keyof typeof lucideIcons
      ] as React.ComponentType<{ className?: string }>)
    : null;
  const RightIcon = iconRight
    ? (lucideIcons[
        iconRight as keyof typeof lucideIcons
      ] as React.ComponentType<{ className?: string }>)
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
      <a href={link} className={buttonClass}>
        {buttonContent}
      </a>
    );
  }

  return (
    <button className={buttonClass} onClick={onClick} type="button">
      {buttonContent}
    </button>
  );
}
