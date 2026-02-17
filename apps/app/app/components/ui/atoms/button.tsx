type ButtonVersion = "primary" | "secondary" | "plain" | "outlined" | "link";
type ButtonSize = "2xl" | "xl" | "lg" | "md" | "sm";

interface ButtonProps {
  version?: ButtonVersion;
  text: string;
  size?: ButtonSize;
  onClick?: () => void;
  link?: string;
  className?: string;
}

const getVersionClass = (version: ButtonVersion): string => {
  const versionClasses: Record<ButtonVersion, string> = {
    primary: "bg-rose-500 text-white shadow hover:shadow-md",
    secondary: "bg-zinc-900 text-white shadow hover:shadow-md",
    plain: "bg-transparent text-zinc-900 hover:bg-black/5",
    outlined:
      "bg-transparent text-zinc-900 border border-zinc-900 hover:bg-black/5",
    link: "bg-transparent text-rose-500 underline hover:opacity-80 active:opacity-60 transition-opacity p-0",
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

export default function Button({
  version = "primary",
  text,
  size = "md",
  onClick,
  link,
  className,
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center rounded-full justify-center font-medium rounded transition-all ease-in-out hover:scale-105";
  const versionClass = getVersionClass(version);
  const sizeClass = getSizeClass(size);
  const buttonClass =
    `${baseClasses} ${versionClass} ${version !== "link" ? sizeClass : ""} ${className || ""}`.trim();

  if (link) {
    return (
      <a href={link} className={buttonClass}>
        {text}
      </a>
    );
  }

  return (
    <button className={buttonClass} onClick={onClick} type="button">
      {text}
    </button>
  );
}
