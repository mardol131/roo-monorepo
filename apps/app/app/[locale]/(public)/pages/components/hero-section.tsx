import Button from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import { type ReactNode } from "react";

type Props = {
  badge?: string;
  heading: string;
  subheading: string;
  primaryCta: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
  image: ReactNode;
};

export default function HeroSection({
  badge,
  heading,
  subheading,
  primaryCta,
  secondaryCta,
  image,
}: Props) {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-full max-w-content px-10 py-20 lg:py-28">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-20">
          <div className="flex flex-1 flex-col gap-6">
            {badge && (
              <span className="inline-flex w-fit items-center rounded-full bg-company-surface px-3 py-1 text-sm font-medium text-company">
                {badge}
              </span>
            )}
            <Text variant="display-2xl" color="textDark">
              {heading}
            </Text>
            <Text variant="h2" color="textLight" className="max-w-lg font-normal">
              {subheading}
            </Text>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                text={primaryCta.text}
                version="companyFull"
                size="2xl"
                link={{ pathname: primaryCta.href }}
              />
              {secondaryCta && (
                <Button
                  text={secondaryCta.text}
                  version="outlined"
                  size="2xl"
                  link={{ pathname: secondaryCta.href }}
                />
              )}
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center">{image}</div>
        </div>
      </div>
    </div>
  );
}
