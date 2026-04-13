"use client";

import React from "react";
import Text from "./../text";
import ErrorText from "./error-text";
import InputLabel from "../input-label";

export default function Input({
  label,
  inputProps,
  error,
  isRequired,
}: {
  label: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  error?: string;
  isRequired?: boolean;
}) {
  return (
    <div className="w-full">
      <InputLabel label={label} isRequired={isRequired} />
      <input
        {...inputProps}
        className={`w-full px-3 text-sm py-2.5 border bg-white ${error ? "border-red-500" : "border-zinc-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent`}
      />
      {error && <ErrorText error={error} />}
    </div>
  );
}
