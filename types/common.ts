// Action result types for Server Actions
export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string>;
};

// Component prop types
export type ServerComponentProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

// Pagination types
export type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalItems: number;
};

// Sort configuration
export type SortConfig = {
  field: string;
  direction: "asc" | "desc";
};

// Filter option type for UI components
export type FilterOption = {
  label: string;
  value: string;
};