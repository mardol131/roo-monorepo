"use client";

import React from "react";
import ErrorText from "./error-text";
import InputLabel from "../input-label";
import Text from "../text";

export default function Input({
  label,
  sublabel,
  inputProps,
  error,
  isRequired,
  disabled,
  filterRegex,
  placeholder,
}: {
  label?: string;
  sublabel?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  error?: string;
  isRequired?: boolean;
  disabled?: boolean;
  filterRegex?: RegExp;
  placeholder?: string;
}) {
  function handleInput(e: React.FormEvent<HTMLInputElement>) {
    if (filterRegex) {
      const input = e.currentTarget;
      const filtered = Array.from(input.value)
        .filter((char) => filterRegex.test(char))
        .join("");
      if (filtered !== input.value) {
        input.value = filtered;
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
    inputProps?.onInput?.(e);
  }

  return (
    <div className={`w-full ${disabled ? "opacity-50" : ""}`}>
      {label && (
        <InputLabel label={label} sublabel={sublabel} isRequired={isRequired} />
      )}

      <input
        {...inputProps}
        disabled={disabled}
        onInput={handleInput}
        placeholder={placeholder}
        className={`w-full px-3 text-sm py-2.5 border bg-white ${error ? "border-red-500" : "border-zinc-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent`}
      />
      {error && <ErrorText error={error} />}
    </div>
  );
}
