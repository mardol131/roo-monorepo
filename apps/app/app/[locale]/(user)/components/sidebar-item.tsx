import Text from "@/app/components/ui/atoms/text";
import { IntlPathname, Link } from "@/app/i18n/navigation";
import { LucideIcons } from "@roo/common";
import * as lucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";

export type SidebarItem = {
  label: string;
  href?: IntlPathname;
  icon: LucideIcons;
  onClick?: () => void;
};

export function SidebarNavItem({
  label,
  href,
  icon,
  onClick,
  active,
}: SidebarItem & { active: boolean }) {
  const Icon = lucideIcons[icon] as React.ElementType;

  const content = href ? (
    <Link
      onClick={onClick}
      href={href}
      className={`flex flex-col items-center gap-1 px-1 py-2.5 rounded-xl transition-all ${
        active
          ? "bg-primary-surface text-primary"
          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
      }`}
    >
      <Icon
        className={`w-5 h-5 shrink-0 ${active ? "text-primary" : "text-zinc-400"}`}
      />
      <Text
        variant="label-sm"
        color={active ? "primary" : "textDark"}
        className="font-semibold text-center"
      >
        {label}
      </Text>
    </Link>
  ) : (
    <button
      onClick={onClick}
      className={`flex flex-col cursor-pointer items-center gap-1 px-1 py-2.5 rounded-xl transition-all ${
        active
          ? "bg-primary-surface text-primary"
          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
      }`}
    >
      <Icon
        className={`w-5 h-5 shrink-0 ${active ? "text-primary" : "text-zinc-400"}`}
      />
      <Text
        variant="label-sm"
        color={"textDark"}
        className="font-semibold text-center"
      >
        {label}
      </Text>
    </button>
  );

  return <li>{content}</li>;
}
