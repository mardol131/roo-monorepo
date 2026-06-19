import { OauthAccount } from "@roo/common";

interface Options {
  provider: OauthAccount["provider"];
  idToken: string;
}

export async function exchangeOAuthToken({ provider, idToken }: Options) {
  return fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/oauth/${provider}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    },
  );
}
