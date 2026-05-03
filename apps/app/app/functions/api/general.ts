import { Config, PayloadResponse, Where } from "@roo/common";
import { success } from "zod";

export async function getCollection<T extends keyof Config["collections"]>({
  collection,
  query,
  limit,
  sort,
}: {
  collection: T;
  query?: Where;
  limit?: number;
  sort?: string;
}): Promise<PayloadResponse<Config["collections"][T]>> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${collection}`,
  );
  if (query) url.searchParams.append("where", JSON.stringify(query));
  if (limit) url.searchParams.append("limit", limit.toString());
  if (sort) url.searchParams.append("sort", sort);

  return await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  }).then((res) => res.json());
}

export async function getCollectionItem<T extends keyof Config["collections"]>({
  collection,
  id,
}: {
  collection: T;
  id: string;
}): Promise<Config["collections"][T]> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${collection}/${id}`,
  );

  return await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  }).then((res) => res.json());
}

export async function patchCollectionItem<
  T extends keyof Config["collections"],
>({
  collection,
  id,
  data,
}: {
  collection: T;
  id: string;
  data: Partial<Config["collections"][T]>;
}): Promise<Config["collections"][T]> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${collection}/${id}`,
  );

  const res = await fetch(url.toString(), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(`Failed to patch item in ${collection}`);
  return res.json();
}

export async function postCollectionItem<
  T extends keyof Config["collections"],
>({
  collection,
  data,
}: {
  collection: T;
  data: Omit<
    Config["collections"][T],
    "id" | "createdAt" | "updatedAt" | "owner" | "slug" | "status"
  >;
}): Promise<{ doc: Config["collections"][T]; message: string }> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${collection}`,
  );

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(`Failed to create item in ${collection}`);
  return res.json();
}

export async function deleteCollectionItem<
  T extends keyof Config["collections"],
>({
  collection,
  id,
}: {
  collection: T;
  id: string;
}): Promise<{ success: boolean }> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${collection}/${id}`,
  );

  const res = await fetch(url.toString(), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) throw new Error(`Failed to delete item from ${collection}`);
  return { success: true };
}
