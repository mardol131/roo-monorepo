import React from "react";
import Text from "../text";

type Props = {};

export default function ErrorText({ error }: { error?: string }) {
  return (
    <Text variant="caption" color="primary" className=" mt-1">
      {error}
    </Text>
  );
}
