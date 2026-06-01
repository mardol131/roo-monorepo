import React from "react";

type Props = {
  children: React.ReactNode;
  bgColor?: string;
};

export function LandingSectionWrapper({ children }: Props) {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-full max-w-pages px-10">{children}</div>
    </div>
  );
}

export function HomepageSectionWrapper({ children, bgColor }: Props) {
  return (
    <div className={`flex items-center justify-center w-full ${bgColor}`}>
      <div className="w-full max-w-[1500px] px-10">{children}</div>
    </div>
  );
}
