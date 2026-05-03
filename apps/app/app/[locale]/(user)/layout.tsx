import { getServerUser } from "@/app/functions/auth/get-server-user";
import { redirect } from "@/app/i18n/navigation";
import { headers } from "next/headers";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default async function layout({ children }: Props) {
  const user = await getServerUser();

  if (!user) {
    const headerStore = await headers();
    const path = headerStore.get("x-pathname") ?? "/";
    redirect({
      href: {
        pathname: "/login-required",
        query: {
          redirectAfterLogin: path,
          requireLogin: "true",
          reasonForRequiredLogin: "not_logged_in",
        },
      },
      locale: "cs",
    });
  }

  return (
    <div>
      <div className="flex min-h-screen bg-zinc-50 w-full">{children}</div>
    </div>
  );
}
