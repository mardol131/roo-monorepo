import { LandingSectionWrapper } from "@/app/components/ui/sections/landing-section-wrapper";
import { getTranslations } from "next-intl/server";
import CenteredHeroSection from "../components/centered-hero-section";
import RoadmapContent from "./roadmap-content";

export default async function page() {
  const t = await getTranslations("pages.roadmap");

  return (
    <>
      <CenteredHeroSection
        badge={t("hero.badge")}
        heading={t("hero.heading")}
        subheading={t("hero.subheading")}
      />
      <LandingSectionWrapper>
        <RoadmapContent
          sections={[
            { status: "in-progress", heading: t("inProgress.heading") },
            { status: "planned", heading: t("planned.heading") },
            { status: "completed", heading: t("completed.heading") },
          ]}
          voteLabel={t("vote")}
          votedLabel={t("voted")}
          emptyLabel={t("empty")}
        />
      </LandingSectionWrapper>
    </>
  );
}
