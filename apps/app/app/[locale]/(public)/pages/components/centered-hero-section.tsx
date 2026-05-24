import Button from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import { IntlLink } from "@/app/i18n/navigation";
import Image from "next/image";

type Props = {
  badge?: string;
  heading: string;
  subheading: string;
  primaryCta?: { text: string; href: IntlLink };
  secondaryCta?: { text: string; href: IntlLink };
  image?: string;
};

export default function CenteredHeroSection({
  badge,
  heading,
  subheading,
  primaryCta,
  secondaryCta,
  image,
}: Props) {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-full max-w-pages px-10 py-20 lg:py-28 flex flex-col items-center gap-16">
        <div className="flex flex-col items-center text-center gap-6 max-w-3xl">
          {badge && (
            <span className="inline-flex w-fit items-center rounded-full bg-company-surface px-3 py-1 text-sm font-medium text-company">
              {badge}
            </span>
          )}
          <Text variant="display-2xl" color="textDark">
            {heading}
          </Text>
          <Text variant="h2" color="textLight" className="font-normal">
            {subheading}
          </Text>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {primaryCta && (
              <Button
                text={primaryCta.text}
                version="companyFull"
                size="xl"
                link={primaryCta.href}
              />
            )}
            {secondaryCta && (
              <Button
                text={secondaryCta.text}
                version="outlined"
                size="xl"
                link={secondaryCta.href}
              />
            )}
          </div>
        </div>

        {image && (
          <div className="w-full rounded-3xl overflow-hidden border border-zinc-100 shadow-sm">
            <Image
              src={image}
              alt={heading}
              width={1400}
              height={700}
              className="w-full h-auto object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
