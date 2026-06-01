import z from "zod";

export const toItem = <T extends { id: string; name: string }>(
  v: string | T,
): { id: string; name: string } =>
  typeof v === "string" ? { id: v, name: "" } : { id: v.id, name: v.name };

export const toIds = (arr: { id: string; name: string }[]): string[] =>
  arr.map((x) => x.id);
