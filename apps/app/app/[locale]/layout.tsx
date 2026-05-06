import { getTranslations } from "next-intl/server";
import React, { PropsWithChildren } from "react";

import type { Locale } from "next-intl";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Root" });
  return {
    title: {
      template: `%s | ${t("appName")}`,
      default: t("appName"),
    },
  };
}

export default function layout({ children }: PropsWithChildren) {
  return <>{children}</>;
}
