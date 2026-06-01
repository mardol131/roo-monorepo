import { getTranslations } from "next-intl/server";
import React, { PropsWithChildren } from "react";

import type { Locale } from "next-intl";
import { ConfirmActionModal } from "../components/ui/molecules/modals/confirm-action-modal";
import LoginModal from "../components/ui/molecules/modals/login-modal/login-modal";
import { SimpleConfirmActionModal } from "../components/ui/molecules/modals/simple-confirm-action-modal";
import { UserImagesGalleryModal } from "../components/ui/molecules/modals/user-images-gallery-modal";
import { GlobalToast } from "../components/ui/molecules/global-toast";
import { NotificationsModal } from "../components/ui/molecules/modals/notifications-modal";
import ContactUsButton from "../components/ui/molecules/contanct-us-button";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "global.root" });
  return {
    title: {
      template: `%s | ${t("appName")}`,
      default: t("appName"),
    },
  };
}

export default function layout({ children }: PropsWithChildren) {
  return (
    <>
      <ConfirmActionModal />
      <LoginModal />
      <SimpleConfirmActionModal />
      <UserImagesGalleryModal />
      <GlobalToast />
      <NotificationsModal />
      <ContactUsButton />
      {children}
    </>
  );
}
