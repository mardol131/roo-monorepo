type ButtonSize = "2xl" | "xl" | "lg" | "md" | "sm" | "xs";
type ButtonRounding = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
export type OAuthProvider = "google" | "facebook" | "github";

const getSizeClass = (size: ButtonSize): string => {
  const sizeClasses: Record<ButtonSize, string> = {
    "2xl": "px-8 py-4 text-2xl",
    xl: "px-7 py-3.5 text-xl",
    lg: "px-6 py-3 text-lg",
    md: "px-4 py-2 text-base",
    sm: "px-3 py-1.5 text-sm",
    xs: "px-2 py-1 text-xs",
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
    xs: "w-3 h-3",
  };
  return iconSizes[size];
};

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

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.27h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
        fill="#1877F2"
      />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
        fill="#181717"
      />
    </svg>
  );
}

const PROVIDER_ICONS: Record<
  OAuthProvider,
  React.ComponentType<{ className?: string }>
> = {
  google: GoogleIcon,
  facebook: FacebookIcon,
  github: GitHubIcon,
};

interface OAuthButtonProps {
  provider: OAuthProvider;
  text?: string;
  size?: ButtonSize;
  rounding?: ButtonRounding;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function OAuthButton({
  provider,
  text = `Přihlásit přes ${provider.charAt(0).toUpperCase() + provider.slice(1)}`,
  size = "md",
  rounding = "lg",
  onClick,
  disabled,
  loading = false,
  className,
}: OAuthButtonProps) {
  const sizeClass = getSizeClass(size);
  const roundingClass = getRoundingClass(rounding);
  const iconSize = getIconSize(size);

  const baseClasses =
    `inline-flex items-center justify-center gap-2 font-semibold transition-all ease-in-out bg-white text-text-dark border border-zinc-200 shadow-sm hover:shadow-md hover:bg-zinc-50 ${!disabled ? "cursor-pointer hover:scale-105" : "opacity-50"} ${roundingClass} ${sizeClass} ${className ?? ""}`.trim();

  const Icon = PROVIDER_ICONS[provider];

  return (
    <button
      className={baseClasses}
      onClick={onClick}
      type="button"
      disabled={disabled || loading}
    >
      {loading ? (
        <svg
          className={`${iconSize} animate-spin text-zinc-400`}
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      ) : (
        <Icon className={iconSize} />
      )}
      {text}
    </button>
  );
}
