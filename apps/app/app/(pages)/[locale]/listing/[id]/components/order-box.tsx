"use client";

import Button from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import { useOrderStore } from "@/app/store/order-store";
import { useParams, useRouter } from "next/navigation";

export default function OrderBox() {
  const { id } = useParams();

  const router = useRouter();
  const { setCurrentStep } = useOrderStore();

  const handleOrderClick = () => {
    setCurrentStep(1);
    router.push(`/inzerat/${id}/poptavka`);
  };
  return (
    <div className="shadow-lg rounded-lg p-6 sticky top-30">
      <Text
        variant="label4"
        as="p"
        color="secondary"
        className="mt-4 bg-zinc-100 p-2 rounded-md text-center"
      >
        Bezplatné zrušení do 10.12.2024
      </Text>
      <Button
        onClick={handleOrderClick}
        size="lg"
        text="Vyplnit poptávku"
        version="primary"
        className="w-full mt-4"
      />
      <Text variant="body5" color="secondary" className="mt-4 text-center">
        Zatím nebude nic účtováno
      </Text>
      <div className="border relative overflow-hidden border-zinc-300 rounded-lg min-h-10 flex items-center justify-between">
        <div className="flex flex-col p-4 w-full">
          <Text variant="label1" color="secondary">
            Prémiový partner ROO
          </Text>
          <Text variant="label4" color="secondary">
            Co to znamená?
          </Text>
        </div>
        <div className="flex gap-3 absolute right-10">
          <div className="w-3 h-20 bg-linear-60 from-primary to-yellow-200 rotate-10"></div>
          <div className="w-3 h-20 bg-linear-60 from-primary to-yellow-200 rotate-10"></div>
          <div className="w-3 h-20 bg-linear-60 from-primary to-yellow-200 rotate-10"></div>
        </div>
      </div>
    </div>
  );
}
