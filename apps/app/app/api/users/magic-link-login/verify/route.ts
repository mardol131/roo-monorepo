import { NextRequest } from "next/server";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const redirectTo = req.nextUrl.searchParams.get("redirectTo") || "/";

  if (!token) {
    return Response.redirect(
      new URL(redirectTo + "?error=missing-token", req.url),
    );
  }

  const params = new URLSearchParams({ token, redirectTo });
  return Response.redirect(
    `${backendUrl}/api/users/magic-link-login/verify-login-token?${params}`,
  );
}
