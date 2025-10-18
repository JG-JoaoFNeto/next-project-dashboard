"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionResult, CreateUserInput, UpdateUserInput } from "@/types";
import { UserStatus } from "@prisma/client";
import type { UserRole } from "@/types/user";

// Helper function to safely convert string to UserRole
function parseUserRole(value: string | null): UserRole {
  if (!value) return "USER";
  
  const upperValue = value.toUpperCase() as UserRole;
  if (["ADMIN", "USER", "MODERATOR"].includes(upperValue)) {
    return upperValue;
  }
  
  return "USER"; // default fallback
}

// Create new user
export async function createUser(
  input: CreateUserInput
): Promise<ActionResult<string>> {
  try {
    // Validate input
    if (!input.name?.trim()) {
      return { success: false, error: "Nome é obrigatório" };
    }

    if (!input.email?.trim()) {
      return { success: false, error: "Email é obrigatório" };
    }

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      return { success: false, error: "Email já está em uso" };
    }

    // Create user
    const user = await db.user.create({
      data: {
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        status: input.status || UserStatus.ACTIVE,
        role: input.role || "USER",
        avatar: input.avatar,
      },
    });

    // Revalidate users page cache
    revalidatePath("/users");
    
    return { success: true, data: user.id };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

// Update existing user
export async function updateUser(
  input: UpdateUserInput
): Promise<ActionResult<void>> {
  try {
    if (!input.id) {
      return { success: false, error: "ID do usuário é obrigatório" };
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id: input.id },
    });

    if (!existingUser) {
      return { success: false, error: "Usuário não encontrado" };
    }

    // If email is being updated, check for conflicts
    if (input.email && input.email !== existingUser.email) {
      const emailExists = await db.user.findUnique({
        where: { email: input.email },
      });

      if (emailExists) {
        return { success: false, error: "Email já está em uso" };
      }
    }

    // Update user
    await db.user.update({
      where: { id: input.id },
      data: {
        ...(input.name && { name: input.name.trim() }),
        ...(input.email && { email: input.email.trim().toLowerCase() }),
        ...(input.status && { status: input.status }),
        ...(input.role && { role: input.role }),
        ...(input.avatar !== undefined && { avatar: input.avatar }),
      },
    });

    // Revalidate users page cache
    revalidatePath("/users");
    revalidatePath(`/users/${input.id}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

// Delete user
export async function deleteUser(id: string): Promise<ActionResult<void>> {
  try {
    if (!id) {
      return { success: false, error: "ID do usuário é obrigatório" };
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return { success: false, error: "Usuário não encontrado" };
    }

    // Delete user
    await db.user.delete({
      where: { id },
    });

    // Revalidate users page cache
    revalidatePath("/users");

    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

// Form action for creating user (with redirect)
export async function createUserAction(formData: FormData) {
  const input: CreateUserInput = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    status: (formData.get("status") as UserStatus) || UserStatus.ACTIVE,
    role: parseUserRole(formData.get("role") as string),
    avatar: formData.get("avatar") as string,
  };

  const result = await createUser(input);

  if (result.success) {
    redirect("/users");
  } else {
    // In a real app, you'd handle this with error states
    throw new Error(result.error);
  }
}

// Form action for updating user (with redirect)
export async function updateUserAction(formData: FormData) {
  const input: UpdateUserInput = {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    status: formData.get("status") as UserStatus,
    role: parseUserRole(formData.get("role") as string),
    avatar: formData.get("avatar") as string,
  };

  const result = await updateUser(input);

  if (result.success) {
    redirect("/users");
  } else {
    // In a real app, you'd handle this with error states
    throw new Error(result.error);
  }
}

// Form action for deleting user
export async function deleteUserAction(formData: FormData) {
  const id = formData.get("id") as string;
  
  const result = await deleteUser(id);

  if (!result.success) {
    throw new Error(result.error);
  }
}