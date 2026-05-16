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
    <section id={id} className="not-last:border-b w-full pb-15 border-zinc-300">
      {(title || subtitle) && (
        <div className="flex items-center gap-2 mb-5">
          {Icon && <Icon className="w-5 h-5 text-zinc-400 shrink-0" />}
          <div>
            {title && <Text variant="h3">{title}</Text>}
            {subtitle && (
              <Text variant="body-sm" color="textLight">
                {subtitle}
              </Text>
            )}
          </div>
        </div>
      )}
      {children}
    </section>
  );
}
