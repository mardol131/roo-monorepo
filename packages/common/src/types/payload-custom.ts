export type PayloadResponse<T> = {
  docs: T[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: number | null;
  page: number;
  pagingCounter: number;
  prevPage: number | null;
  totalDocs: number;
  totalPages: number;
};

export type WhereCondition = {
  equals?: unknown;
  contains?: unknown;
  not_equals?: unknown;
  in?: unknown;
  all?: unknown;
  not_in?: unknown;
  exists?: unknown;
  greater_than?: unknown;
  greater_than_equal?: unknown;
  less_than?: unknown;
  less_than_equal?: unknown;
  like?: unknown;
  not_like?: unknown;
  within?: unknown;
  intersects?: unknown;
  near?: unknown;
};

export type Where = {
  [key: string]: Where[] | WhereCondition | undefined;
  and?: Where[];
  or?: Where[];
};
