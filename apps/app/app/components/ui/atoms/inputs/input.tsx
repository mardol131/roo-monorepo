"use client";

import React from "react";
import ErrorText from "./error-text";
import InputLabel from "../input-label";
import Text from "../text";

export default function Input({
  label,
  subLabel,
  inputProps,
  error,
  isRequired,
  disabled,
}: {
  label: string;
  subLabel?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  error?: string;
  isRequired?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className={`w-full ${disabled ? "opacity-50" : ""}`}>
      <InputLabel label={label} isRequired={isRequired} />
      {subLabel && (
        <Text variant="label3" color="light">
          {subLabel}
        </Text>
      )}
      <input
        {...inputProps}
        disabled={disabled}
        className={`w-full px-3 text-sm py-2.5 border bg-white ${error ? "border-red-500" : "border-zinc-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent`}
      />
      {error && <ErrorText error={error} />}
    </div>
  );
}
