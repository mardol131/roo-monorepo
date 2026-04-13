import React from "react";
import Text from "./text";

type Props = {
  label: string;
  isRequired?: boolean;
};

export default function InputLabel({ label, isRequired }: Props) {
  return (
    <label className="mb-1.5 flex gap-1">
      <Text variant="label2" color="dark" className="font-semibold">
        {label}
      </Text>
      {isRequired && <span className="text-red-500 -mb-4">*</span>}
    </label>
  );
}
