import { redirect } from "@/app/i18n/navigation";
import { getLocale } from "next-intl/server";

export default async function CatalogPage() {
  const locale = await getLocale();
  redirect({ href: { pathname: "/catalog/[type]", params: { type: "misto" } }, locale });
}
