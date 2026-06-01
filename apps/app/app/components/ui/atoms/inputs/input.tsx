"use client";

import React, { useEffect } from "react";
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
  maxLength,
  size = "base",
}: {
  label?: string;
  sublabel?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  error?: string;
  isRequired?: boolean;
  disabled?: boolean;
  filterRegex?: RegExp;
  placeholder?: string;
  maxLength?: number;
  size?: "base" | "sm";
}) {
  const [charCount, setCharCount] = React.useState(() => {
    const v = inputProps?.value ?? inputProps?.defaultValue;
    return typeof v === "string" ? v.length : 0;
  });

  useEffect(() => {
    const v = inputProps?.value;
    if (typeof v === "string") {
      setCharCount(v.length);
    }
  }, [inputProps?.value]);

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
    setCharCount(e.currentTarget.value.length);
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
        maxLength={maxLength}
        className={`w-full px-3 text-sm border bg-white ${error ? "border-danger" : "border-zinc-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent ${size === "sm" ? "text-sm py-1.5" : "text-base py-2.5"}`}
      />
      {error && (
        <div>
          <ErrorText error={error} />
        </div>
      )}
      {maxLength && (
        <div className="flex justify-between items-start mt-1 min-h-5">
          {maxLength !== undefined && (
            <Text
              variant="caption"
              color={charCount >= maxLength ? "danger" : "textLight"}
            >
              {charCount}/{maxLength}
            </Text>
          )}
        </div>
      )}
    </div>
  );
}
