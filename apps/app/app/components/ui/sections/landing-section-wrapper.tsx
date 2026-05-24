import React from "react";

type Props = {
  children: React.ReactNode;
};

export function LandingSectionWrapper({ children }: Props) {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-full max-w-pages px-10">{children}</div>
    </div>
  );
}

export function HomepageSectionWrapper({ children }: Props) {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-full max-w-content px-10">{children}</div>
    </div>
  );
}
