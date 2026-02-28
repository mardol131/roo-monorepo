import React from "react";
import Text from "./text";

type Props = {
  label: string;
};

export default function InputLabel({ label }: Props) {
  return (
    <Text
      variant="heading4"
      color="dark"
      className="font-semibold mb-1.5 block"
    >
      {label}
    </Text>
  );
}
