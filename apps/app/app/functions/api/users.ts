import { User } from "@roo/common";

const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function login(email: string, password: string) {
  const response = await fetch(`${apiUrl}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  return response;
}

export async function registerUser({
  email,
  password,
  firstName,
  lastName,
  phone,
  type,
  gdprConsent,
  termsOfUseConsent,
  marketingConsent,
}: Omit<User, "id" | "updatedAt" | "createdAt">) {
  const response = await fetch(`${apiUrl}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
      firstName,
      lastName,
      type,
      phone,
      gdprConsent,
      termsOfUseConsent,
      marketingConsent,
    }),
  });

  return response;
}

export async function switchAccountTypeToCompany() {
  const response = await fetch(`${apiUrl}/api/users`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ type: "company" }),
  });
  return response;
}

export async function logout() {
  const response = await fetch(`${apiUrl}/api/users/logout`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  return response;
}
export async function refreshUser() {
  const response = await fetch(`${apiUrl}/api/users/me`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  return response;
}
