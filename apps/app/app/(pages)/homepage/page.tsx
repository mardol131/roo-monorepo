import LandingSectionWrapper from "@/app/components/ui/sections/landing-section-wrapper";
import HeroSection from "./components/hero-section";

type Props = {};

export default function page({}: Props) {
  return (
    <div className="min-h-screen">
      <LandingSectionWrapper>
        <HeroSection />
      </LandingSectionWrapper>
    </div>
  );
}
