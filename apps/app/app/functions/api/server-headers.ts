import { cookies } from "next/headers";

export async function getServerCookieHeaders(): Promise<
  Record<string, string>
> {
  const cookieStore = await cookies();
  return { Cookie: cookieStore.toString() };
}
