import { getServerUser } from "@/app/functions/auth/get-server-user";
import { redirect } from "@/app/i18n/navigation";
import { headers } from "next/headers";
import React from "react";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return <>{children}</>;
}
