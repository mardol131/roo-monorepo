import { LandingSectionWrapper } from "@/app/components/ui/sections/landing-section-wrapper";
import {
  ROO_LISTING_DISCOUNT_PERCENT,
  ROO_LISTING_DISCOUNTED_PRICE_PER_MONTH,
  ROO_LISTING_PRICE_PER_MONTH,
  type LucideIcons,
} from "@roo/common";
import { getTranslations } from "next-intl/server";
import AudienceCardsSection from "../components/audience-cards-section";
import CenteredHeroSection from "../components/centered-hero-section";
import CtaSection from "../components/cta-section";
import FaqSection from "../components/faq-section";
import FeaturesSection from "../components/features-section";
import PricingSection from "../components/pricing-section";

export default async function page() {
  const t = await getTranslations("pages.pricing");

  return (
    <>
      <CenteredHeroSection
        badge={t("hero.badge")}
        heading={t("hero.heading")}
        subheading={t("hero.subheading")}
      />

      <LandingSectionWrapper>
        <AudienceCardsSection
          organizer={{
            label: t("audienceCards.organizer.label"),
            heading: t("audienceCards.organizer.heading"),
            price: t("audienceCards.organizer.price"),
            description: t("audienceCards.organizer.description"),
            anchorId: "pro-organizatory",
          }}
          supplier={{
            label: t("audienceCards.supplier.label"),
            heading: t("audienceCards.supplier.heading"),
            price: `${ROO_LISTING_DISCOUNTED_PRICE_PER_MONTH} ${t("audienceCards.supplier.priceUnit")}`,
            originalPrice: `${ROO_LISTING_PRICE_PER_MONTH} ${t("audienceCards.supplier.priceUnit")}`,
            discountPercent: ROO_LISTING_DISCOUNT_PERCENT,
            description: t("audienceCards.supplier.description"),
            anchorId: "pro-dodavatele",
          }}
        />
      </LandingSectionWrapper>

      <LandingSectionWrapper>
        <div id="pro-organizatory" className="scroll-mt-24 w-full">
          <FeaturesSection
            badge={t("forOrganizers.badge")}
            heading={t("forOrganizers.heading")}
            subheading={t("forOrganizers.subheading")}
            columns={3}
            features={[
              {
                icon: "UserCheck" as LucideIcons,
                title: t("forOrganizers.feature1.title"),
                description: t("forOrganizers.feature1.description"),
              },
              {
                icon: "Banknote" as LucideIcons,
                title: t("forOrganizers.feature2.title"),
                description: t("forOrganizers.feature2.description"),
              },
              {
                icon: "ShieldCheck" as LucideIcons,
                title: t("forOrganizers.feature3.title"),
                description: t("forOrganizers.feature3.description"),
              },
            ]}
          />
        </div>
      </LandingSectionWrapper>

      <LandingSectionWrapper>
        <div id="pro-dodavatele" className="scroll-mt-24 w-full">
          <PricingSection
            badge={t("forSuppliers.badge")}
            heading={t("forSuppliers.heading")}
            subheading={t("forSuppliers.subheading")}
            planName={t("forSuppliers.planName")}
            price={ROO_LISTING_PRICE_PER_MONTH}
            discountedPrice={ROO_LISTING_DISCOUNTED_PRICE_PER_MONTH}
            discountPercent={ROO_LISTING_DISCOUNT_PERCENT}
            payDescription={t("forSuppliers.payDescription")}
            payNote={t("forSuppliers.payNote")}
            features={[
              t("forSuppliers.feature1"),
              t("forSuppliers.feature2"),
              t("forSuppliers.feature3"),
              t("forSuppliers.feature4"),
              t("forSuppliers.feature5"),
              t("forSuppliers.feature6"),
            ]}
            cta={{ text: t("forSuppliers.cta"), href: "/register-company" }}
          />
        </div>
      </LandingSectionWrapper>

      <LandingSectionWrapper>
        <FaqSection
          badge={t("faq.badge")}
          heading={t("faq.heading")}
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
          secondaryCta={{ text: t("cta.secondaryCta"), href: "/catalog" }}
        />
      </LandingSectionWrapper>
    </>
  );
}
