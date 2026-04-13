"use client";

import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import { useSpace } from "@/app/react-query/spaces/hooks";
import { useSearchParams } from "next/navigation";

type Props = {};

export default function page({}: Props) {
  const searchParams = useSearchParams();
  const { data: space } = useSpace(searchParams.get("parentId") || "");
  console.log(space);
  return (
    <main className="w-full">
      <PageHeading
        heading="Nový prostor"
        description="Vyberte typ prostoru, který chcete vytvořit."
      />
    </main>
  );
}
