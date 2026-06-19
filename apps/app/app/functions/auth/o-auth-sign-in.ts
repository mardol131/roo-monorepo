import { OauthAccount } from "@roo/common";
import { signIn } from "next-auth/react";

export function oAuthSignIn(
  provider: OauthAccount["provider"],
  redirectTo?: string,
) {
  signIn(provider, { callbackUrl: redirectTo ?? "/" });
}
