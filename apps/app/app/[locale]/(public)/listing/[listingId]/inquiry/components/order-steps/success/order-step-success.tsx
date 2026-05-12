"use client";

import Button from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import { useRouter } from "@/app/i18n/navigation";
import { CheckCircle2 } from "lucide-react";

export default function OrderStepSuccess() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center text-center gap-6 py-4">
      <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
      </div>
      <div className="flex flex-col gap-2">
        <Text variant="h3" color="textDark" className="font-bold">
          Poptávka byla odeslána!
        </Text>
        <Text variant="body" color="secondary" className="max-w-sm">
          Dodavatel vás do 48 hodin kontaktuje s potvrzením dostupnosti a
          dalšími detaily.
        </Text>
      </div>
      <Button
        text="Přejít na moje poptávky"
        version="primary"
        iconRight="ArrowRight"
        onClick={() =>
          router.push({
            pathname: "/user-profile/inquiries",
          })
        }
      />
    </div>
  );
}
