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
}: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: {
    countryCode: string;
    number: string;
  };
  type: User["type"];
}) {
  const response = await fetch(`${apiUrl}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password, firstName, lastName, type, phone }),
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
