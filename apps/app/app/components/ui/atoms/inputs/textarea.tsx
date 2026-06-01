"use client";

import React, { useEffect } from "react";
import InputLabel from "../input-label";
import Text from "../text";
import ErrorText from "./error-text";

export function Textarea({
  label,
  inputProps,
  error,
  maxLength,
  height,
}: {
  label: string;
  inputProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  error?: string;
  maxLength?: number;
  height?: string;
}) {
  const [charCount, setCharCount] = React.useState(() => {
    const v = inputProps?.value ?? inputProps?.defaultValue;
    return typeof v === "string" ? v.length : 0;
  });

  useEffect(() => {
    const v = inputProps?.value ?? inputProps?.defaultValue;
    setCharCount(typeof v === "string" ? v.length : 0);
  }, [inputProps?.value, inputProps?.defaultValue]);

  function handleInput(e: React.FormEvent<HTMLTextAreaElement>) {
    setCharCount(e.currentTarget.value.length);
    inputProps?.onInput?.(e);
  }

  return (
    <div className="flex flex-col">
      <InputLabel label={label} isRequired={inputProps?.required} />
      <textarea
        {...inputProps}
        onInput={handleInput}
        maxLength={maxLength}
        className={`${height ?? ""} w-full text-sm px-3 py-2.5 border bg-white ${error ? "border-danger" : "border-zinc-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent resize-none`}
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
