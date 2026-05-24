"use client";

import Button from "@/app/components/ui/atoms/button";
import { companyMemberVerify } from "@/app/functions/api/companies";
import { useState } from "react";

type State = "idle" | "loading" | "success" | "error";

type Props = {
  companyMemberInviteToken: string;
};

export default function AcceptInviteButton({
  companyMemberInviteToken,
}: Props) {
  const [state, setState] = useState<State>("idle");
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleAccept = async () => {
    setState("loading");
    try {
      const res = await companyMemberVerify(companyMemberInviteToken);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setErrorMessage(body.error ?? "Něco se pokazilo");
        setState("error");
      } else {
        setState("success");
      }
    } catch {
      setErrorMessage("Nepodařilo se spojit se serverem");
      setState("error");
    }
  };

  if (state === "success") {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-green-600 font-medium">
          Pozvánka byla úspěšně přijata.
        </p>
        <Button
          version="primary"
          text="Přejít do aplikace"
          link={{ pathname: "/company-profile" }}
        />
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-red-500">{errorMessage}</p>
        <Button
          version="plain"
          text="Přejít na hlavní stránku"
          link={{ pathname: "/homepage" }}
        />
      </div>
    );
  }

  return (
    <Button
      version="primary"
      text="Přijmout pozvánku"
      iconLeft="UserCheck"
      loading={state === "loading"}
      onClick={handleAccept}
    />
  );
}
