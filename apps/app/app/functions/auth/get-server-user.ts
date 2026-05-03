import { User } from "@roo/common";
import { cookies } from "next/headers";

export async function getServerUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me`, {
    headers: {
      Cookie: cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; "),
    },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.user ?? null;
}
