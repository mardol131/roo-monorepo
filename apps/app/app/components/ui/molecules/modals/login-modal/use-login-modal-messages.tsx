"use client";

import { useSearchParams } from "next/navigation";
import {
  loginModalSeachParamsMessages,
  loginModalSearchParamsGroups,
} from "./login-modal-params";

type MessageType = "error" | "info" | "success";

type LoginModalMessage = {
  type: MessageType;
  message: string;
};

const messageMap: Record<
  string,
  Record<string, LoginModalMessage>
> = {
  [loginModalSearchParamsGroups.loginModalError]: {
    [loginModalSeachParamsMessages.loginModalError.missing_token]: {
      type: "error",
      message: "Chybí token pro ověření emailu.",
    },
    [loginModalSeachParamsMessages.loginModalError.invalid_token]: {
      type: "error",
      message: "Token pro ověření emailu je neplatný nebo vypršel.",
    },
  },
  [loginModalSearchParamsGroups.reasonForRequiredLogin]: {
    [loginModalSeachParamsMessages.reasonForRequiredLogin.not_logged_in]: {
      type: "info",
      message: "Pro pokračování je nutné se přihlásit.",
    },
  },
  [loginModalSearchParamsGroups.loginModalInfo]: {
    [loginModalSeachParamsMessages.loginModalInfo.email_change_failed]: {
      type: "info",
      message:
        "Pro pokračování je nutné se přihlásit. Změna emailu se nezdařila.",
    },
  },
  [loginModalSearchParamsGroups.loginModalSuccess]: {
    [loginModalSeachParamsMessages.loginModalSuccess.email_change_success]: {
      type: "success",
      message:
        "Změna emailu byla úspěšná. Pro pokračování je nutné se přihlásit.",
    },
  },
};

export function useLoginModalMessages(): LoginModalMessage[] {
  const params = useSearchParams();

  return Object.keys(loginModalSearchParamsGroups).reduce<LoginModalMessage[]>(
    (acc, groupKey) => {
      const paramValue = params.get(groupKey);
      if (paramValue) {
        const matched = messageMap[groupKey]?.[paramValue];
        if (matched) {
          acc.push(matched);
        }
      }
      return acc;
    },
    [],
  );
}
