export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function getPaginationParams(page?: number, limit?: number) {
  const safePage = Math.max(1, page || 1);
  const safeLimit = Math.min(100, Math.max(1, limit || 10));
  const offset = (safePage - 1) * safeLimit;
  return { page: safePage, limit: safeLimit, offset };
}
