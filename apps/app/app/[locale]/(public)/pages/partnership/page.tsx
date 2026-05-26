import { LandingSectionWrapper } from "@/app/components/ui/sections/landing-section-wrapper";
import { type LucideIcons } from "@roo/common";
import { getTranslations } from "next-intl/server";
import BenefitsSection from "../components/benefits-section";
import CenteredHeroSection from "../components/centered-hero-section";
import CtaSection from "../components/cta-section";
import FaqSection from "../components/faq-section";
import FeaturesSection from "../components/features-section";
import ManifestoSection from "../components/manifesto-section";
import StepsSection from "../components/steps-section";

export default async function page() {
  const t = await getTranslations("pages.partnership");

  return (
    <>
      <CenteredHeroSection
        badge={t("hero.badge")}
        heading={t("hero.heading")}
        subheading={t("hero.subheading")}
        primaryCta={{
          text: t("cta.primaryCta"),
          href: { pathname: "/pages/contact" },
        }}
        image="https://images.unsplash.com/photo-1582192730841-2a682d7375f9?auto=format&fit=crop&w=1400&q=80"
      />

      <LandingSectionWrapper>
        <BenefitsSection
          heading={t("exchange.heading")}
          subheading={t("exchange.subheading")}
          benefits={[
            {
              image: t("exchange.benefit1.image"),
              title: t("exchange.benefit1.title"),
              description: t("exchange.benefit1.description"),
            },
            {
              image: t("exchange.benefit2.image"),
              title: t("exchange.benefit2.title"),
              description: t("exchange.benefit2.description"),
            },
            {
              image: t("exchange.benefit3.image"),
              title: t("exchange.benefit3.title"),
              description: t("exchange.benefit3.description"),
            },
          ]}
        />
      </LandingSectionWrapper>

      <LandingSectionWrapper>
        <StepsSection
          columns={2}
          badge={t("steps.badge")}
          heading={t("steps.heading")}
          cta={{ text: t("cta.primaryCta"), href: { pathname: "/pages/contact" } }}
          steps={[
            {
              title: t("steps.step1.title"),
              description: t("steps.step1.description"),
            },
            {
              title: t("steps.step2.title"),
              description: t("steps.step2.description"),
            },
            {
              title: t("steps.step3.title"),
              description: t("steps.step3.description"),
            },
            {
              title: t("steps.step4.title"),
              description: t("steps.step4.description"),
            },
          ]}
        />
      </LandingSectionWrapper>

      <LandingSectionWrapper>
        <ManifestoSection quote="Věříme, že nejlepší spolupráce vzniká tehdy, když obě strany sdílí stejné hodnoty. Rádi bychom s vámi budovali něco, na co budeme oba hrdí." />
      </LandingSectionWrapper>

      <LandingSectionWrapper>
        <FeaturesSection
          columns={3}
          badge={t("formats.badge")}
          heading={t("formats.heading")}
          subheading={t("formats.subheading")}
          features={[
            {
              icon: "Video" as LucideIcons,
              title: t("formats.format1.title"),
              description: t("formats.format1.description"),
            },
            {
              icon: "Share2" as LucideIcons,
              title: t("formats.format2.title"),
              description: t("formats.format2.description"),
            },
            {
              icon: "FileText" as LucideIcons,
              title: t("formats.format3.title"),
              description: t("formats.format3.description"),
            },
            {
              icon: "Camera" as LucideIcons,
              title: t("formats.format4.title"),
              description: t("formats.format4.description"),
            },
            {
              icon: "Repeat2" as LucideIcons,
              title: t("formats.format5.title"),
              description: t("formats.format5.description"),
            },
            {
              icon: "Lightbulb" as LucideIcons,
              title: t("formats.format6.title"),
              description: t("formats.format6.description"),
            },
          ]}
        />
      </LandingSectionWrapper>

      <LandingSectionWrapper>
        <FaqSection
          badge={t("faq.badge")}
          heading={t("faq.heading")}
          subheading={t("faq.subheading")}
          items={[
            { question: t("faq.q1.question"), answer: t("faq.q1.answer") },
            { question: t("faq.q2.question"), answer: t("faq.q2.answer") },
            { question: t("faq.q3.question"), answer: t("faq.q3.answer") },
            { question: t("faq.q4.question"), answer: t("faq.q4.answer") },
            { question: t("faq.q5.question"), answer: t("faq.q5.answer") },
          ]}
        />
      </LandingSectionWrapper>

      <LandingSectionWrapper>
        <CtaSection
          heading={t("cta.heading")}
          subheading={t("cta.subheading")}
          primaryCta={{ text: t("cta.primaryCta"), href: "/pages/contact" }}
          secondaryCta={{ text: t("cta.secondaryCta"), href: "/pages/faq" }}
        />
      </LandingSectionWrapper>
    </>
  );
}
