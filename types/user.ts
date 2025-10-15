import { User as PrismaUser, UserStatus } from "@prisma/client";

// Re-export Prisma types for convenience
export type { UserStatus } from "@prisma/client";

// Base User type from Prisma
export type User = PrismaUser;

// User creation type (without auto-generated fields)
export type CreateUserInput = {
  name: string;
  email: string;
  status?: UserStatus;
  role?: string;
  avatar?: string;
};

// User update type (all fields optional except id)
export type UpdateUserInput = {
  id: string;
  name?: string;
  email?: string;
  status?: UserStatus;
  role?: string;
  avatar?: string;
};

// Search/Filter parameters
export type UserFilters = {
  search?: string;
  status?: UserStatus | "all";
  role?: string;
  page?: number;
  limit?: number;
  sortBy?: "name" | "email" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
};

// API Response types
export type UsersResponse = {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// Form validation types
export type UserFormErrors = {
  name?: string;
  email?: string;
  status?: string;
  role?: string;
};

// Search params type for Next.js App Router
export type UserSearchParams = {
  search?: string;
  status?: string;
  role?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
};