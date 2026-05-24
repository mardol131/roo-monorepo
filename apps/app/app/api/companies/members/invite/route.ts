import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const cookieStore = await cookies();

  const res = await fetch(`${backendUrl}/api/companies/invite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; "),
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
