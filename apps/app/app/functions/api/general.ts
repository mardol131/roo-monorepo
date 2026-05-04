import { Config, PayloadResponse, Where } from "@roo/common";
import { stringify } from "qs-esm";
import { success } from "zod";

export type GetCollectionOptions<T extends keyof Config["collections"]> = {
  collection: T;
  query?: Where;
  limit?: number;
  sort?: string;
};

export async function getCollection<T extends keyof Config["collections"]>({
  collection,
  query,
  limit,
  sort,
}: GetCollectionOptions<T>): Promise<
  PayloadResponse<Config["collections"][T]>
> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${collection}`;
  const stringifiedQuery = query
    ? stringify({ where: query }, { encodeValuesOnly: true })
    : undefined;
  const limitQuery = limit ? `limit=${limit}` : undefined;
  const sortQuery = sort ? `sort=${sort}` : undefined;

  const queryParams = [stringifiedQuery, limitQuery, sortQuery]
    .filter(Boolean)
    .join("&");

  const res = await fetch(`${url}?${queryParams}`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Failed to fetch collection ${collection}`);
  return res.json();
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

  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) throw new Error(`Failed to fetch item from ${collection}`);
  return res.json();
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
