"use client";

import { useState } from "react";
import { deleteUserAction } from "@/lib/actions/user-actions";
import { useToast } from "@/app/components/ui/Toast";
import { ConfirmDeleteModal } from "../../components/ui/ConfirmDeleteModal";
import type { UserStatus } from "@/types/user";

interface DeleteButtonProps {
  userId: string;
  userName: string;
  userEmail: string;
  userStatus: UserStatus;
  userAvatar?: string | null;
}

export function DeleteButton({ 
  userId, 
  userName, 
  userEmail, 
  userStatus, 
  userAvatar
}: DeleteButtonProps) {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const formData = new FormData();
      formData.append("id", userId);
      await deleteUserAction(formData);
      showToast(`Usuário "${userName}" excluído com sucesso!`, "success");
      setIsModalOpen(false);
    } catch (error) {
      showToast("Erro ao excluir usuário. Tente novamente.", "error");
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="group inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all duration-200 hover:shadow-sm hover:shadow-red-100 hover:-translate-y-0.5"
      >
        <svg className="w-4 h-4 mr-2 transition-transform group-hover:scale-105" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Excluir
      </button>
      
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        userName={userName}
        userEmail={userEmail}
        userStatus={userStatus}
        userAvatar={userAvatar}
        isDeleting={isDeleting}
      />
    </>
  );
}