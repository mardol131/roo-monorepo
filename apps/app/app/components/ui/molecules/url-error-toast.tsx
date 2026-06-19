"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { globalToastEvents } from "./global-toast";

const ERROR_MESSAGES: Record<string, string> = {
  "missing-token": "Odkaz pro přihlášení je neplatný.",
  "invalid-token": "Odkaz pro přihlášení vypršel nebo byl již použit.",
};

const DEFAULT_ERROR_MESSAGE = "Nastala neočekávaná chyba.";

export function UrlErrorToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const error = searchParams.get("error");
    if (!error) return;

    globalToastEvents.emit("open", {
      type: "error",
      message: ERROR_MESSAGES[error] ?? DEFAULT_ERROR_MESSAGE,
      duration: 10000,
    });

    const params = new URLSearchParams(searchParams.toString());
    params.delete("error");
    const newSearch = params.toString();
    router.replace(`${pathname}${newSearch ? `?${newSearch}` : ""}`, {
      scroll: false,
    });
  }, []);

  return null;
}
