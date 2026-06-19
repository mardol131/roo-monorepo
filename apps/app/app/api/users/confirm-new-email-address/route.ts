import {
  loginModalSeachParamsMessages,
  loginModalSearchParamsGroups,
} from "@/app/components/ui/molecules/modals/login-modal/login-modal-params";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const logoutRes = await fetch(`${backendUrl}/api/users/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookieHeader },
  });

  function buildRedirect(
    success: "success" | "failure" | undefined,
    error?: keyof (typeof loginModalSeachParamsMessages)["loginModalError"],
  ) {
    const url = new URL("/", req.url);
    if (error)
      url.searchParams.set(loginModalSearchParamsGroups.loginModalError, error);
    if (success === "success") {
      url.searchParams.set(
        loginModalSearchParamsGroups.loginModalSuccess,
        loginModalSeachParamsMessages.loginModalSuccess.email_change_success,
      );
    } else if (success === "failure") {
      url.searchParams.set(
        loginModalSearchParamsGroups.loginModalInfo,
        loginModalSeachParamsMessages.loginModalInfo.email_change_failed,
      );
    }

    url.searchParams.set(
      "redirectAfterLogin",
      req.nextUrl.searchParams.get("redirectTo") ?? "/",
    );
    url.searchParams.set("requireLogin", "true");
    const response = NextResponse.redirect(url);
    const setCookie = logoutRes.headers.get("set-cookie");
    if (setCookie) response.headers.set("set-cookie", setCookie);
    return response;
  }

  if (!token) {
    return buildRedirect(undefined, "missing_token");
  }

  const res = await fetch(`${backendUrl}/api/users/confirm-new-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookieHeader },
    body: JSON.stringify({ token }),
  });

  if (!res.ok) {
    return buildRedirect(undefined, "invalid_token");
  }

  return buildRedirect("success");
}
