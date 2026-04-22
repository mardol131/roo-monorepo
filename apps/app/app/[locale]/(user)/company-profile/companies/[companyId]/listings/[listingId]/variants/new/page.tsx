"use client";

import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import Button from "@/app/components/ui/atoms/button";
import NewVariantForm, {
  VARIANT_FORM_GROUPS,
} from "./components/new-variant-form";
import FormToc from "@/app/[locale]/(user)/components/form-toc";
import { useParams } from "next/navigation";
import { useRouter } from "@/app/i18n/navigation";

type Props = {};

export default function page({}: Props) {
  const { companyId, listingId } = useParams<{
    companyId: string;
    listingId: string;
  }>();
  const router = useRouter();

  return (
    <main className="w-full">
      <PageHeading
        heading="Nová varianta"
        description="Zde můžete vytvořit novou variantu služby, kterou budete nabízet zákazníkům."
      />
      <Button
        version="plain"
        iconLeft="ArrowLeft"
        className="mb-4"
        text="Zpět"
        size="sm"
        link={{
          pathname:
            "/company-profile/companies/[companyId]/listings/[listingId]/variants",
          params: {
            companyId,
            listingId,
          },
        }}
      />
      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <NewVariantForm
            onSubmit={(data) => {
              console.log("submit", data);
            }}
            onCancel={() => router.back()}
          />
        </div>

        <div className="w-52 shrink-0 hidden lg:block">
          <div className="flex flex-col gap-5 sticky top-5">
            <FormToc
              textColor="text-variant"
              dotColor="text-variant"
              surfaceColor="bg-variant-surface"
              groups={VARIANT_FORM_GROUPS}
              sticky={false}
            />
            <div className="flex flex-col gap-2">
              <Button
                text="Přejít na uložení"
                version="variantFull"
                className="w-full"
                onClick={() => {
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                  });
                }}
              />
              <Button
                text="Zrušit"
                version="plain"
                className="w-full"
                onClick={() => router.back()}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
