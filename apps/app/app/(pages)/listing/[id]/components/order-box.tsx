"use client";

import Button from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import React from "react";
import { FaStar } from "react-icons/fa";
import { Offer } from "./offer-item";
import { useOrderStore } from "@/app/store/order-store";

type Props = {
  offers: Offer[];
};

export default function OrderBox({ offers }: Props) {
  const orderStore = useOrderStore();
  return (
    <div className="shadow-lg rounded-lg p-6 sticky top-30">
      <Text variant="body1" className="mb-4">
        Od <span className="font-bold">500 Kč</span> za akci
      </Text>
      <div className="border-2 rounded-xl border-zinc-100 min-h-30 grid grid-cols-2">
        <div className="col-span-2 border-zinc-100">
          <Text
            variant="label4"
            color="secondary"
            className="p-2 font-semibold"
          >
            Počet hostů
          </Text>
        </div>
        <div className="col-span-2 border-t-2 border-zinc-100">
          <Text
            variant="label4"
            color="secondary"
            className="p-2 font-semibold"
          >
            Kde
          </Text>
        </div>
        <div className="col-span-2 border-t-2 border-zinc-100">
          <Text
            variant="label4"
            color="secondary"
            className="p-2 font-semibold"
          >
            Datum akce
          </Text>
        </div>
      </div>
      <Text
        variant="label4"
        as="p"
        color="secondary"
        className="mt-4 bg-zinc-100 p-2 rounded-md text-center"
      >
        Bezplatné zrušení do 10.12.2024
      </Text>
      <Button
        onClick={() => orderStore.openOrderModal()}
        size="lg"
        text="Odeslat poptávku"
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
