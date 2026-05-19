import Text from "@/app/components/ui/atoms/text";
import React, { PropsWithChildren } from "react";

interface SectionWrapperProps {
  title?: string;
  subtitle?: string;
  icon?: React.ElementType;
  id?: string;
}

export default function SectionWrapper({
  children,
  title,
  subtitle,
  icon: Icon,
  id,
}: PropsWithChildren<SectionWrapperProps>) {
  return (
    <section id={id} className="not-last:border-b w-full py-5 border-zinc-100">
      {(title || subtitle) && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            {Icon && <Icon className="w-5 h-5 text-primary shrink-0" />}
            {title && (
              <Text
                variant="h3"
                color="textDark"
                className="font-display uppercase"
              >
                {title}
              </Text>
            )}
          </div>
          <div className="w-8 h-0.5 bg-primary rounded-full" />
          {subtitle && (
            <Text variant="body-sm" color="textLight" className="mt-3">
              {subtitle}
            </Text>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
