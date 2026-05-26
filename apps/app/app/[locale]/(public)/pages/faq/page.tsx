import { LandingSectionWrapper } from "@/app/components/ui/sections/landing-section-wrapper";
import { getTranslations } from "next-intl/server";
import CenteredHeroSection from "../components/centered-hero-section";
import CtaSection from "../components/cta-section";
import FaqContent from "./faq-content";

export default async function page() {
  const t = await getTranslations("pages.faq");

  const [
    tGeneral,
    tRegistration,
    tListings,
    tInquiries,
    tPricing,
    tForSuppliers,
    tForOrganizers,
    tTechnical,
  ] = await Promise.all([
    getTranslations("pages.faq.groups.general"),
    getTranslations("pages.faq.groups.registration"),
    getTranslations("pages.faq.groups.listings"),
    getTranslations("pages.faq.groups.inquiries"),
    getTranslations("pages.faq.groups.pricing"),
    getTranslations("pages.faq.groups.forSuppliers"),
    getTranslations("pages.faq.groups.forOrganizers"),
    getTranslations("pages.faq.groups.technical"),
  ]);

  const faqGroups = [
    {
      key: "general",
      title: tGeneral("title"),
      questions: (["q1", "q2", "q3", "q4"] as const).map((k) => ({
        question: tGeneral(`questions.${k}.question`),
        answer: tGeneral(`questions.${k}.answer`),
      })),
    },
    {
      key: "registration",
      title: tRegistration("title"),
      questions: (["q1", "q2", "q3", "q4", "q5"] as const).map((k) => ({
        question: tRegistration(`questions.${k}.question`),
        answer: tRegistration(`questions.${k}.answer`),
      })),
    },
    {
      key: "listings",
      title: tListings("title"),
      questions: (["q1", "q2", "q3", "q4", "q5", "q6"] as const).map((k) => ({
        question: tListings(`questions.${k}.question`),
        answer: tListings(`questions.${k}.answer`),
      })),
    },
    {
      key: "inquiries",
      title: tInquiries("title"),
      questions: (["q1", "q2", "q3", "q4", "q5"] as const).map((k) => ({
        question: tInquiries(`questions.${k}.question`),
        answer: tInquiries(`questions.${k}.answer`),
      })),
    },
    {
      key: "pricing",
      title: tPricing("title"),
      questions: (["q1", "q2", "q3", "q4", "q5", "q6"] as const).map((k) => ({
        question: tPricing(`questions.${k}.question`),
        answer: tPricing(`questions.${k}.answer`),
      })),
    },
    {
      key: "forSuppliers",
      title: tForSuppliers("title"),
      questions: (["q1", "q2", "q3", "q4", "q5"] as const).map((k) => ({
        question: tForSuppliers(`questions.${k}.question`),
        answer: tForSuppliers(`questions.${k}.answer`),
      })),
    },
    {
      key: "forOrganizers",
      title: tForOrganizers("title"),
      questions: (["q1", "q2", "q3", "q4", "q5"] as const).map((k) => ({
        question: tForOrganizers(`questions.${k}.question`),
        answer: tForOrganizers(`questions.${k}.answer`),
      })),
    },
    {
      key: "technical",
      title: tTechnical("title"),
      questions: (["q1", "q2", "q3", "q4", "q5"] as const).map((k) => ({
        question: tTechnical(`questions.${k}.question`),
        answer: tTechnical(`questions.${k}.answer`),
      })),
    },
  ];

  return (
    <>
      <CenteredHeroSection
        badge={t("hero.badge")}
        heading={t("hero.heading")}
        subheading={t("hero.subheading")}
      />
      <LandingSectionWrapper>
        <FaqContent groups={faqGroups} />
      </LandingSectionWrapper>
      <LandingSectionWrapper>
        <CtaSection
          heading="Připraveni začít?"
          subheading="Zaregistrujte se zdarma a začněte plánovat akce nebo prezentujte svůj prostor."
          primaryCta={{ text: "Registrace zdarma", href: "/register" }}
          secondaryCta={{ text: "Jsem dodavatel", href: "/register-company" }}
        />
      </LandingSectionWrapper>
    </>
  );
}
