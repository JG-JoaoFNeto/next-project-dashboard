"use server";

import { db } from "@/lib/db";
import type { User, UsersResponse, UserSearchParams } from "@/types";
import { UserStatus } from "@prisma/client";

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  try {
    const user = await db.user.findUnique({
      where: { id },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

// Get users with filtering, pagination and sorting
export async function getUsers(
  searchParams: UserSearchParams = {}
): Promise<UsersResponse> {
  try {
    // Await searchParams for Next.js 15+
    const awaitedParams = await searchParams;
    
    // Parse and validate parameters
    const search = awaitedParams.search || "";
    const status = awaitedParams.status || "all";
    const role = awaitedParams.role || "";
    const page = parseInt(awaitedParams.page || "1", 10);
    const limit = parseInt(awaitedParams.limit || "10", 10);
    const sortBy = awaitedParams.sortBy || "createdAt";
    const sortOrder = awaitedParams.sortOrder || "desc";

    // Build where clause
    const whereClause: Record<string, unknown> = {};

    // Search filter (name or email)
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // Status filter
    if (status !== "all" && Object.values(UserStatus).includes(status as UserStatus)) {
      whereClause.status = status as UserStatus;
    }

    // Role filter
    if (role) {
      whereClause.role = { contains: role, mode: "insensitive" };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await db.user.count({ where: whereClause });

    // Get users with filters and pagination
    const users = await db.user.findMany({
      where: whereClause,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      users,
      total,
      page,
      limit,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      users: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };
  }
}

// Get user statistics for dashboard
export async function getUserStats() {
  try {
    const [total, active, pending, inactive] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { status: UserStatus.ACTIVE } }),
      db.user.count({ where: { status: UserStatus.PENDING } }),
      db.user.count({ where: { status: UserStatus.INACTIVE } }),
    ]);

    return { total, active, pending, inactive };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return { total: 0, active: 0, pending: 0, inactive: 0 };
  }
}

// Get all available roles (for filters)
export async function getUserRoles(): Promise<string[]> {
  try {
    const roles = await db.user.findMany({
      select: { role: true },
      distinct: ["role"],
    });

    return roles.map((r) => r.role).filter(Boolean);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
}