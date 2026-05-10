import React from "react";
import Text from "./text";

type Props = {
  label: string;
  isRequired?: boolean;
  sublabel?: string;
};

export default function InputLabel({ label, isRequired, sublabel }: Props) {
  return (
    <div className="mb-1.5">
      <label className=" flex gap-1">
        <Text variant="label-lg" color="textDark" className="font-semibold">
          {label}
        </Text>
        {isRequired && <span className="text-red-500 -mb-4">*</span>}
      </label>
      {sublabel && (
        <Text variant="caption" color="textLight" className="font-semibold">
          {sublabel}
        </Text>
      )}
    </div>
  );
}
