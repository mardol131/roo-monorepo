import { IntlPathname, Link } from "@/app/i18n/navigation";
import { LucideIcon } from "lucide-react";

export type SidebarItem = {
  label: string;
  href: IntlPathname;
  icon: LucideIcon;
  onClick?: () => void;
};

export function SidebarNavItem({
  label,
  href,
  icon: Icon,
  onClick,
  active,
}: SidebarItem & { active: boolean }) {
  return (
    <li>
      <Link
        onClick={onClick}
        href={href}
        className={`flex flex-col items-center gap-1 px-1 py-2.5 rounded-xl transition-all ${
          active
            ? "bg-rose-50 text-primary"
            : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
        }`}
      >
        <Icon
          className={`w-5 h-5 shrink-0 ${active ? "text-primary" : "text-zinc-400"}`}
        />
        <span className="text-[10px] font-medium leading-tight text-center">
          {label}
        </span>
      </Link>
    </li>
  );
}
