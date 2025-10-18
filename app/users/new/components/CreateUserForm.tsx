"use client";

import { useState } from "react";
import { createUserAction } from "@/lib/actions/user-actions";
import { UserStatus } from "@prisma/client";
import { ROLE_LABELS, STATUS_LABELS, UserRole } from "@/types/user";

export function CreateUserForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Status options with Portuguese labels
  const statusOptions = [
    { label: STATUS_LABELS.ACTIVE, value: UserStatus.ACTIVE },
    { label: STATUS_LABELS.PENDING, value: UserStatus.PENDING },
    { label: STATUS_LABELS.INACTIVE, value: UserStatus.INACTIVE },
  ];

  // Role options with Portuguese labels
  const roleOptions = Object.entries(ROLE_LABELS).map(([key, label]) => ({
    label,
    value: key as UserRole,
  }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    
    // Client-side validation
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    
    const newErrors: Record<string, string> = {};
    
    if (!name?.trim()) {
      newErrors.name = "Nome é obrigatório";
    }
    
    if (!email?.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email deve ter um formato válido";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await createUserAction(formData);
      
      // If result exists, it means there was an error
      if (result && !result.success) {
        const newErrors: Record<string, string> = {};
        
        // Handle different error types with user-friendly messages
        if (result.errorType === "duplicate_email") {
          newErrors.email = "Este email já está cadastrado. Por favor, use outro email.";
        } else {
          newErrors.general = result.error || "Erro ao criar usuário. Tente novamente.";
        }
        
        setErrors(newErrors);
        setIsSubmitting(false);
        return;
      }
      
      // If we reach here, the action was successful and should have redirected
    } catch (error) {
      console.error("Error creating user:", error);
      setErrors({ 
        general: "Erro inesperado. Tente novamente." 
      });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Error */}
      {errors.general && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{errors.general}</p>
            </div>
          </div>
        </div>
      )}

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-900 ">
          Nome completo *
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="name"
            id="name"
            required
            className={`text-gray-600 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.name 
                ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Digite o nome completo"
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-600">{errors.name}</p>
          )}
        </div>
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-900">
          Email *
        </label>
        <div className="mt-1">
          <input
            type="email"
            name="email"
            id="email"
            required
            className={`text-gray-600 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.email 
                ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Digite o email"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Status Field */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-900">
          Status
        </label>
        <div className="mt-1">
          <select
            name="status"
            id="status"
            defaultValue={UserStatus.ACTIVE}
            className=" text-gray-600 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Role Field */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-900">
          Função
        </label>
        <div className="mt-1">
          <select
            name="role"
            id="role"
            defaultValue="USER"
            className="text-gray-600 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Avatar Field */}
      <div>
        <label htmlFor="avatar" className="block text-sm font-medium text-gray-900">
          Avatar (URL)
        </label>
        <div className="mt-1">
          <input
            type="url"
            name="avatar"
            id="avatar"
            className="text-gray-600 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="https://example.com/avatar.jpg (opcional)"
          />
          <p className="mt-2 text-sm text-gray-500">
            Opcional: URL de uma imagem para o avatar do usuário
          </p>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Criando...
            </>
          ) : (
            "Criar Usuário"
          )}
        </button>
      </div>
    </form>
  );
}