import { cookies } from "next/headers";
import { OauthAccount } from "@roo/common";
import { exchangeOAuthToken } from "./exchange-oauth-token";

export async function signInWithOAuth({
  provider,
  idToken,
}: {
  provider: OauthAccount["provider"];
  idToken: string;
}): Promise<boolean> {
  const response = await exchangeOAuthToken({ provider, idToken });

  if (!response.ok) return false;

  const setCookieHeader = response.headers.get("set-cookie");
  if (setCookieHeader) {
    const tokenMatch = setCookieHeader.match(/payload-token=([^;]+)/);
    if (tokenMatch) {
      const cookieStore = await cookies();
      cookieStore.set("payload-token", tokenMatch[1], {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }
  }

  return true;
}
