"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function layout({ children }: Props) {
  return (
    <>
      <div
        className={`w-full flex flex-col justify-center items-center px-8 py-20`}
      >
        <div className="max-w-user-profile-content w-full px-8">{children}</div>
      </div>
    </>
  );
}
