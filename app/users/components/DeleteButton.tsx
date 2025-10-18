"use client";

import { deleteUserAction } from "@/lib/actions/user-actions";
import { useToast } from "@/app/components/ui/Toast";

interface DeleteButtonProps {
  userId: string;
  userName: string;
}

export function DeleteButton({ userId, userName }: DeleteButtonProps) {
  const { showToast } = useToast();

  const handleDelete = async () => {
    if (!confirm(`Tem certeza que deseja excluir o usuário "${userName}"?`)) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id", userId);
      await deleteUserAction(formData);
      showToast(`Usuário "${userName}" excluído com sucesso!`, "success");
    } catch (error) {
      showToast("Erro ao excluir usuário. Tente novamente.", "error");
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