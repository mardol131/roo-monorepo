import React, { PropsWithChildren } from "react";

export default function layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col gap-30 mb-20">{children}</div>
  );
}
