import Button from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import { IntlLink } from "@/app/i18n/navigation";

type Props = {
  heading: string;
  subheading?: string;
  primaryCta: { text: string; href: IntlLink };
  secondaryCta?: { text: string; href: IntlLink };
};

export default function CtaSection({
  heading,
  subheading,
  primaryCta,
  secondaryCta,
}: Props) {
  return (
    <div className="w-full rounded-3xl overflow-hidden bg-zinc-900 px-10 py-16 flex flex-col items-center gap-6 text-center relative">
      <span className="pointer-events-none select-none absolute -bottom-6 right-8 text-9xl font-black text-white/5 leading-none">
        roo
      </span>
      <div className="relative z-10 flex flex-col items-center gap-6">
        <Text variant="display-lg" color="white">
          {heading}
        </Text>
        {subheading && (
          <Text variant="body-lg" color="white" className="opacity-60 max-w-xl">
            {subheading}
          </Text>
        )}
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Button
            text={primaryCta.text}
            version="white"
            size="xl"
            link={primaryCta.href}
          />
          {secondaryCta && (
            <Button
              text={secondaryCta.text}
              version="primary"
              size="xl"
              link={secondaryCta.href}
            />
          )}
        </div>
      </div>
    </div>
  );
}
