import {
  GetCollectionCountOptions,
  getCollectionItemsCount,
} from "@/app/functions/api/general";
import { Config } from "@roo/common";

export async function getAnyCollectionItemsCount<
  T extends keyof Config["collections"],
>(options: GetCollectionCountOptions<T>) {
  const res = await getCollectionItemsCount(options);
  if (!res) throw new Error("Failed to fetch inquiries");
  return res;
}
