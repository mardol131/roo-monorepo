import React, { PropsWithChildren } from "react";

export default function SectionWrapper({ children }: PropsWithChildren<{}>) {
  return (
    <div className="not-last:border-b w-full pb-15 border-zinc-300">
      {children}
    </div>
  );
}
