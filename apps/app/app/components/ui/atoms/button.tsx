type ButtonVersion = "primary" | "secondary" | "plain" | "outlined" | "link";
type ButtonSize = "small" | "medium" | "large";

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
    primary:
      "bg-rose-500 text-white shadow hover:shadow-md active:shadow-sm transition-shadow",
    secondary:
      "bg-zinc-900 text-white shadow hover:shadow-md active:shadow-sm transition-shadow",
    plain:
      "bg-transparent text-zinc-900 hover:bg-black/5 active:bg-black/10 transition-colors",
    outlined:
      "bg-transparent text-zinc-900 border border-zinc-900 hover:bg-black/5 active:bg-black/10 transition-colors",
    link: "bg-transparent text-rose-500 underline hover:opacity-80 active:opacity-60 transition-opacity p-0",
  };
  return versionClasses[version];
};

const getSizeClass = (size: ButtonSize): string => {
  const sizeClasses: Record<ButtonSize, string> = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };
  return sizeClasses[size];
};

export default function Button({
  version = "primary",
  text,
  size = "medium",
  onClick,
  link,
  className,
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded transition-transform hover:-translate-y-0.5 active:translate-y-0";
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
