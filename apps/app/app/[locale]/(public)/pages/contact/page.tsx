import { LandingSectionWrapper } from "@/app/components/ui/sections/landing-section-wrapper";
import { getTranslations } from "next-intl/server";
import CenteredHeroSection from "../components/centered-hero-section";
import ContactSection from "../components/contact-section";

export default async function page() {
  const t = await getTranslations("pages.contact");

  return (
    <>
      <CenteredHeroSection
        badge={t("hero.badge")}
        heading={t("hero.heading")}
        subheading={t("hero.subheading")}
      />

      <LandingSectionWrapper>
        <ContactSection
          badge={t("general.badge")}
          heading={t("general.heading")}
          items={[
            {
              icon: "mail",
              label: t("general.item1.label"),
              value: t("general.item1.value"),
              note: t("general.item1.note"),
              href: "mailto:hello@roo.cz",
            },
            {
              icon: "mail",
              label: t("general.item2.label"),
              value: t("general.item2.value"),
              note: t("general.item2.note"),
              href: "mailto:podpora@roo.cz",
            },
            {
              icon: "mail",
              label: t("general.item3.label"),
              value: t("general.item3.value"),
              note: t("general.item3.note"),
              href: "mailto:partnerstvi@roo.cz",
            },
            {
              icon: "location",
              label: t("general.item4.label"),
              value: t("general.item4.value"),
              note: t("general.item4.note"),
            },
            {
              icon: "hours",
              label: t("general.item5.label"),
              value: t("general.item5.value"),
              note: t("general.item5.note"),
            },
          ]}
        />
      </LandingSectionWrapper>
    </>
  );
}
