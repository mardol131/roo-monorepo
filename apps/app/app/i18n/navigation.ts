import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";
import { ComponentProps } from "react";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

export type IntlPathname = Parameters<typeof getPathname>[0]["href"];
export type IntlLink = ComponentProps<typeof Link>["href"];
