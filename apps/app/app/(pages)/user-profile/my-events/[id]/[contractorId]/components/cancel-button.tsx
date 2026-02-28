"use client";

import React, { useState } from "react";
import Text from "@/app/components/ui/atoms/text";
import { AlertTriangle, XCircle } from "lucide-react";

export default function CancelButton() {
  const [showConfirm, setShowConfirm] = useState(false);

  if (showConfirm) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <Text variant="label1" color="dark" className="font-semibold">
              Zrušit poptávku?
            </Text>
            <Text variant="label4" color="secondary" className="mt-0.5">
              Tato akce je nevratná. Dodavatel bude informován.
            </Text>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowConfirm(false)}
            className="flex-1 px-4 py-2 text-sm font-semibold text-zinc-600 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-xl transition-colors"
          >
            Ponechat
          </button>
          <button
            type="button"
            className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors"
          >
            Potvrdit zrušení
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setShowConfirm(true)}
      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 border border-red-200 rounded-xl transition-colors"
    >
      <XCircle className="w-4 h-4" />
      Zrušit poptávku
    </button>
  );
}
