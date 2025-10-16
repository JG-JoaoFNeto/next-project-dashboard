import { User as PrismaUser, UserStatus } from "@prisma/client";

// UserRole enum (matches Prisma schema)
export type UserRole = "ADMIN" | "USER" | "MODERATOR";

// Re-export Prisma types for convenience
export type { UserStatus } from "@prisma/client";

// Base User type from Prisma
export type User = PrismaUser;

// Role labels mapping (ENUM → Portuguese)
export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Administrador",
  USER: "Usuário",
  MODERATOR: "Moderador"
} as const;

// Status labels mapping (for consistency)
export const STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo", 
  PENDING: "Pendente"
} as const;

// Helper functions for UI display
export function getRoleLabel(role: UserRole): string {
  return ROLE_LABELS[role];
}

export function getStatusLabel(status: UserStatus): string {
  return STATUS_LABELS[status];
}

// User creation type (without auto-generated fields)
export type CreateUserInput = {
  name: string;
  email: string;
  status?: UserStatus;
  role?: UserRole;
  avatar?: string;
};

// User update type (all fields optional except id)
export type UpdateUserInput = {
  id: string;
  name?: string;
  email?: string;
  status?: UserStatus;
  role?: UserRole;
  avatar?: string;
};

// Search/Filter parameters
export type UserFilters = {
  search?: string;
  status?: UserStatus | "all";
  role?: UserRole | "all";
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