export interface CfFetchResponse<TResponse> {
  data: TResponse;
  pagination: { index: number; pageSize: number; resultCount: number; totalCount: number };
}
