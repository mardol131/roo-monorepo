import { redirect } from "next/navigation";
import React from "react";

type Props = {};

export default function page({}: Props) {
  redirect("/katalog/gastro");
  return <div>page</div>;
}
