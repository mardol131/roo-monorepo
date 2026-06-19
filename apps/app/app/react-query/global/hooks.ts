import { useQuery } from "@tanstack/react-query";
import { getAnyCollectionItemsCount } from "./fetch";
import { GetCollectionCountOptions } from "@/app/functions/api/general";
import { Config } from "@roo/common";
import { globalKeys } from "../query-keys";

export function useCollectionItemsCount<T extends keyof Config["collections"]>(
  options: GetCollectionCountOptions<T>,
) {
  return useQuery({
    queryKey: globalKeys.count(options),
    queryFn: () => getAnyCollectionItemsCount(options),
    enabled: !!options.collection, // Only enable the query if a collection is provided
  });
}
