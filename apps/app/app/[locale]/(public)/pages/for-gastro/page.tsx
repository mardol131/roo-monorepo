import { LandingSectionWrapper } from "@/app/components/ui/sections/landing-section-wrapper";
import {
  ROO_LISTING_DISCOUNTED_PRICE_PER_MONTH,
  ROO_LISTING_DISCOUNT_PERCENT,
  ROO_LISTING_PRICE_PER_MONTH,
} from "@roo/common";
import { type LucideIcons } from "@roo/common";
import { getTranslations } from "next-intl/server";
import BenefitsSection from "../components/benefits-section";
import CenteredHeroSection from "../components/centered-hero-section";
import ComparisonSection from "../components/comparison-section";
import CtaSection from "../components/cta-section";
import FaqSection from "../components/faq-section";
import FeaturesSection from "../components/features-section";
import PricingSection from "../components/pricing-section";
import StepsSection from "../components/steps-section";

export default async function page() {
  const t = await getTranslations("pages.forGastro");

  return (
    <>
      <CenteredHeroSection
        badge={t("hero.badge")}
        heading={t("hero.heading")}
        subheading={t("hero.subheading")}
        primaryCta={{
          text: t("hero.primaryCta"),
          href: { pathname: "/register-company" },
        }}
        secondaryCta={{
          text: t("hero.secondaryCta"),
          href: { pathname: "/pages/faq" },
        }}
        image="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80"
      />

      <LandingSectionWrapper>
        <StepsSection
          badge={t("steps.badge")}
          heading={t("steps.heading")}
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
          ]}
        />
      </LandingSectionWrapper>

      <LandingSectionWrapper>
        <BenefitsSection
          heading={t("benefits.heading")}
          subheading={t("benefits.subheading")}
          benefits={[
            {
              image:
                "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80",
              title: t("benefits.benefit1.title"),
              description: t("benefits.benefit1.description"),
            },
            {
              image:
                "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=800&q=80",
              title: t("benefits.benefit2.title"),
              description: t("benefits.benefit2.description"),
            },
            {
              image:
                "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80",
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
              icon: "Search" as LucideIcons,
              title: t("features.feature1.title"),
              description: t("features.feature1.description"),
            },
            {
              icon: "MessageSquare" as LucideIcons,
              title: t("features.feature2.title"),
              description: t("features.feature2.description"),
            },
            {
              icon: "CalendarCheck" as LucideIcons,
              title: t("features.feature3.title"),
              description: t("features.feature3.description"),
            },
            {
              icon: "LayoutDashboard" as LucideIcons,
              title: t("features.feature4.title"),
              description: t("features.feature4.description"),
            },
            {
              icon: "Users" as LucideIcons,
              title: t("features.feature5.title"),
              description: t("features.feature5.description"),
            },
            {
              icon: "UtensilsCrossed" as LucideIcons,
              title: t("features.feature6.title"),
              description: t("features.feature6.description"),
            },
          ]}
        />
      </LandingSectionWrapper>

      <LandingSectionWrapper>
        <ComparisonSection
          badge={t("comparison.badge")}
          heading={t("comparison.heading")}
          subheading={t("comparison.subheading")}
          ourLabel={t("comparison.ourLabel")}
          theirLabel={t("comparison.theirLabel")}
          ours={[
            { text: t("comparison.our1") },
            { text: t("comparison.our2") },
            { text: t("comparison.our3") },
            { text: t("comparison.our4") },
            { text: t("comparison.our5") },
          ]}
          theirs={[
            { text: t("comparison.their1") },
            { text: t("comparison.their2") },
            { text: t("comparison.their3") },
            { text: t("comparison.their4") },
            { text: t("comparison.their5") },
          ]}
        />
      </LandingSectionWrapper>

      <LandingSectionWrapper>
        <PricingSection
          badge={t("pricing.badge")}
          heading={t("pricing.heading")}
          subheading={t("pricing.subheading")}
          planName={t("pricing.planName")}
          price={ROO_LISTING_PRICE_PER_MONTH}
          discountedPrice={ROO_LISTING_DISCOUNTED_PRICE_PER_MONTH}
          discountPercent={ROO_LISTING_DISCOUNT_PERCENT}
          features={[
            t("pricing.feature1"),
            t("pricing.feature2"),
            t("pricing.feature3"),
            t("pricing.feature4"),
            t("pricing.feature5"),
            t("pricing.feature6"),
          ]}
          payNote={t("pricing.payNote")}
          cta={{
            text: t("pricing.cta"),
            href: { pathname: "/register-company" },
          }}
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
            { question: t("faq.q6.question"), answer: t("faq.q6.answer") },
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
