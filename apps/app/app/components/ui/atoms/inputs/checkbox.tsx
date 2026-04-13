import React from "react";
import Text from "../text";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import ErrorText from "./error-text";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
  id?: string;
  name?: string;
  value?: string;
  error?: string;
  size?: "sm" | "md" | "lg";
  isRequired?: boolean;
  checkColor?: string;
}

function Checkbox({
  checked,
  onChange,
  label,
  id,
  name,
  value,
  error,
  size = "md",
  isRequired = false,
  checkColor = "text-primary",
}: CheckboxProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <div>
      <label className="flex items-center gap-3 w-full rounded-md hover:bg-white transition-all duration-200 cursor-pointer">
        <input
          id={id}
          type="checkbox"
          name={name}
          value={value}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div className="shrink-0 transition-transform duration-200 hover:scale-110">
          {checked ? (
            <MdCheckBox className={`${sizeClasses[size]} ${checkColor}`} />
          ) : (
            <MdCheckBoxOutlineBlank
              className={`${sizeClasses[size]} text-zinc-300 hover:text-zinc-400`}
            />
          )}
        </div>
        <div className="flex gap-1">
          <Text
            variant={size === "sm" ? "label3" : "body5"}
            color={checked ? "dark" : "secondary"}
            className="transition-colors duration-200"
          >
            {label}
          </Text>
          {isRequired && <span className="text-red-500 -mb-4">*</span>}
        </div>
      </label>
      {error && <ErrorText error={error} />}
    </div>
  );
}

export default Checkbox;
