import { LandingSectionWrapper } from "@/app/components/ui/sections/landing-section-wrapper";
import { type LucideIcons } from "@roo/common";
import { getTranslations } from "next-intl/server";
import BenefitsSection from "../components/benefits-section";
import CenteredHeroSection from "../components/centered-hero-section";
import CtaSection from "../components/cta-section";
import FeaturesSection from "../components/features-section";
import ManifestoSection from "../components/manifesto-section";

export default async function page() {
  const t = await getTranslations("pages.about");

  const features: {
    icon: LucideIcons;
    title: string;
    description: string;
  }[] = [
    {
      icon: "Sparkles",
      title: t("values.value1.title"),
      description: t("values.value1.description"),
    },
    {
      icon: "Scale",
      title: t("values.value2.title"),
      description: t("values.value2.description"),
    },
    {
      icon: "Handshake",
      title: t("values.value3.title"),
      description: t("values.value3.description"),
    },
    {
      icon: "Target",
      title: t("values.value4.title"),
      description: t("values.value4.description"),
    },
    {
      icon: "Ear",
      title: t("values.value5.title"),
      description: t("values.value5.description"),
    },
    {
      icon: "MapPin",
      title: t("values.value6.title"),
      description: t("values.value6.description"),
    },
  ];

  return (
    <>
      <CenteredHeroSection
        badge={t("hero.badge")}
        heading={t("hero.heading")}
        subheading={t("hero.subheading")}
        image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80"
      />

      <LandingSectionWrapper>
        <ManifestoSection quote={t("manifesto.quote")} />
      </LandingSectionWrapper>

      <LandingSectionWrapper>
        <BenefitsSection
          heading={t("story.heading")}
          benefits={[
            {
              image: t("story.part1.image"),
              title: t("story.part1.title"),
              description: t("story.part1.description"),
            },
            {
              image: t("story.part2.image"),
              title: t("story.part2.title"),
              description: t("story.part2.description"),
            },
            {
              image: t("story.part3.image"),
              title: t("story.part3.title"),
              description: t("story.part3.description"),
            },
          ]}
        />
      </LandingSectionWrapper>

      <LandingSectionWrapper>
        <FeaturesSection
          badge={t("values.badge")}
          heading={t("values.heading")}
          subheading={t("values.subheading")}
          features={features}
        />
      </LandingSectionWrapper>

      <LandingSectionWrapper>
        <CtaSection
          heading={t("cta.heading")}
          subheading={t("cta.subheading")}
          primaryCta={{ text: t("cta.primaryCta"), href: "/register" }}
          secondaryCta={{ text: t("cta.secondaryCta"), href: "/pages/faq" }}
        />
      </LandingSectionWrapper>
    </>
  );
}
