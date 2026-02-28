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
}

function Checkbox({
  checked,
  onChange,
  label,
  id,
  name,
  value,
  error,
}: CheckboxProps) {
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
            <MdCheckBox className="h-5 w-5 text-rose-500" />
          ) : (
            <MdCheckBoxOutlineBlank className="h-5 w-5 text-zinc-300 hover:text-zinc-400" />
          )}
        </div>
        <Text
          variant="body4"
          color={checked ? "dark" : "secondary"}
          className="transition-colors duration-200"
        >
          {label}
        </Text>
      </label>
      {error && <ErrorText error={error} />}
    </div>
  );
}

export default Checkbox;
