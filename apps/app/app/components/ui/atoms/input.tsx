"use client";

import React from "react";
import Text from "./text";

export default function Input({
  label,
  inputProps,
  onChange,
}: {
  label: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  onChange?: (value: string) => void;
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
        className="w-full px-3 py-2.5 border bg-white border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
