import { LandingSectionWrapper } from "@/app/components/ui/sections/landing-section-wrapper";
import { type LucideIcons } from "@roo/common";
import { getTranslations } from "next-intl/server";
import BenefitsSection from "../components/benefits-section";
import CenteredHeroSection from "../components/centered-hero-section";
import CtaSection from "../components/cta-section";
import FaqSection from "../components/faq-section";
import FeaturesSection from "../components/features-section";
import ScrollStepsSection from "../components/scroll-steps-section";

export default async function page() {
  const t = await getTranslations("pages.howItWorksForCompany");

  return (
    <>
      <CenteredHeroSection
        badge={t("hero.badge")}
        heading={t("hero.heading")}
        subheading={t("hero.subheading")}
        image="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1400&q=80"
      />

      <LandingSectionWrapper>
        <ScrollStepsSection
          badge={t("scrollSteps.badge")}
          heading={t("scrollSteps.heading")}
          subheading={t("scrollSteps.subheading")}
          steps={[
            {
              title: t("scrollSteps.step1.title"),
              description: t("scrollSteps.step1.description"),
              image: t("scrollSteps.step1.image"),
            },
            {
              title: t("scrollSteps.step2.title"),
              description: t("scrollSteps.step2.description"),
              image: t("scrollSteps.step2.image"),
            },
            {
              title: t("scrollSteps.step3.title"),
              description: t("scrollSteps.step3.description"),
              image: t("scrollSteps.step3.image"),
            },
            {
              title: t("scrollSteps.step4.title"),
              description: t("scrollSteps.step4.description"),
              image: t("scrollSteps.step4.image"),
            },
          ]}
        />
      </LandingSectionWrapper>

      <LandingSectionWrapper>
        <BenefitsSection
          heading={t("benefits.heading")}
          subheading={t("benefits.subheading")}
          benefits={[
            {
              image: t("benefits.benefit1.image"),
              title: t("benefits.benefit1.title"),
              description: t("benefits.benefit1.description"),
            },
            {
              image: t("benefits.benefit2.image"),
              title: t("benefits.benefit2.title"),
              description: t("benefits.benefit2.description"),
            },
            {
              image: t("benefits.benefit3.image"),
              title: t("benefits.benefit3.title"),
              description: t("benefits.benefit3.description"),
            },
          ]}
        />
      </LandingSectionWrapper>

      <LandingSectionWrapper>
        <FeaturesSection
          badge={t("features.badge")}
          heading={t("features.heading")}
          subheading={t("features.subheading")}
          features={[
            {
              icon: "Building2" as LucideIcons,
              title: t("features.feature1.title"),
              description: t("features.feature1.description"),
            },
            {
              icon: "Inbox" as LucideIcons,
              title: t("features.feature2.title"),
              description: t("features.feature2.description"),
            },
            {
              icon: "MessageSquare" as LucideIcons,
              title: t("features.feature3.title"),
              description: t("features.feature3.description"),
            },
            {
              icon: "CalendarCheck" as LucideIcons,
              title: t("features.feature4.title"),
              description: t("features.feature4.description"),
            },
            {
              icon: "Layers" as LucideIcons,
              title: t("features.feature5.title"),
              description: t("features.feature5.description"),
            },
            {
              icon: "Users" as LucideIcons,
              title: t("features.feature6.title"),
              description: t("features.feature6.description"),
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
          primaryCta={{ text: t("cta.primaryCta"), href: "/register-company" }}
          secondaryCta={{ text: t("cta.secondaryCta"), href: "/pages/faq" }}
        />
      </LandingSectionWrapper>
    </>
  );
}
