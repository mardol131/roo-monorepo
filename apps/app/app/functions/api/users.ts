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
  roles,
  gdprConsent,
  termsOfUseConsent,
  marketingConsent,
  redirectTo,
}: Omit<User, "id" | "updatedAt" | "createdAt"> & { redirectTo?: string }) {
  const response = await fetch(`${apiUrl}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
      firstName,
      lastName,
      roles,
      phone,
      gdprConsent,
      termsOfUseConsent,
      marketingConsent,
      redirectTo,
    }),
  });

  return response;
}

export async function verifyUsersEmail(token: string) {
  const res = await fetch(`${apiUrl}/api/users/verify/${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res;
}

export async function changeEmail(userId: string, email: string) {
  return fetch(`${apiUrl}/api/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email }),
  });
}

export async function changePassword(userId: string, password: string) {
  return fetch(`${apiUrl}/api/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ password }),
  });
}

export async function switchAccountTypeToCompany(userId: string) {
  const response = await fetch(`${apiUrl}/api/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ type: "company" }),
  });
  return response;
}

export async function logout() {
  const response = await fetch(`${apiUrl}/api/users/logout?allSesions=false`, {
    method: "POST",
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

export async function refreshToken() {
  const response = await fetch(`${apiUrl}/api/users/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  return response;
}
