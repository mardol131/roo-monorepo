import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function layout({ children }: Props) {
  return (
    <div>
      <div className="flex min-h-screen bg-zinc-50">{children}</div>
    </div>
  );
}
