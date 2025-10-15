"use client";

import { deleteUserAction } from "@/lib/actions/user-actions";

interface DeleteButtonProps {
  userId: string;
  userName: string;
}

export function DeleteButton({ userId, userName }: DeleteButtonProps) {
  const handleDelete = async () => {
    if (!confirm(`Tem certeza que deseja excluir o usuário "${userName}"?`)) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id", userId);
      await deleteUserAction(formData);
    } catch (error) {
      alert("Erro ao excluir usuário. Tente novamente.");
      console.error("Delete error:", error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50"
    >
      Excluir
    </button>
  );
}