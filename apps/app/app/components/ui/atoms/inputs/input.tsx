"use client";

import React from "react";
import Text from "./../text";
import ErrorText from "./error-text";

export default function Input({
  label,
  inputProps,
  onChange,
  error,
}: {
  label: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  onChange?: (value: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={inputProps?.id} className="block mb-1.5">
        <Text variant="label2" color="dark" className="font-semibold">
          {label}
        </Text>
      </label>
      <input
        {...inputProps}
        className={`w-full px-3 py-2.5 border bg-white ${error ? "border-red-500" : "border-zinc-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent`}
        onChange={(e) => onChange?.(e.target.value)}
      />
      {error && <ErrorText error={error} />}
    </div>
  );
}
