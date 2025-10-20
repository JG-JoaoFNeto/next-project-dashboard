"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getStatusLabel } from "@/types/user";
import type { UserStatus } from "@/types/user";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  userEmail: string;
  userStatus: UserStatus;
  userAvatar?: string | null;
  isDeleting: boolean;
}

export function ConfirmDeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  userName,
  userEmail,
  userStatus,
  userAvatar,
  isDeleting
}: ConfirmDeleteModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ zIndex: 9999 }} data-modal="true">
      {/* Subtle backdrop - preserves page visibility */}
      <div className="fixed inset-0 bg-gray-900/10 backdrop-blur-[2px]" onClick={onClose} style={{ zIndex: 9998 }} />
      
      {/* Modal Card - Clean and Modern */}
      <div className="relative bg-white rounded-xl shadow-2xl border border-gray-100 w-full mx-auto transform transition-all duration-300 ease-out scale-100 opacity-100" style={{ zIndex: 10000, maxWidth: '420px', width: '90%' }}>
          
        {/* Header - Clean and Simple */}
        <div className="p-6 pb-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Excluir usuário
          </h3>
          <p className="text-sm text-gray-600">
            Deseja realmente excluir <span className="font-medium text-gray-900">{userName}</span>?
          </p>
        </div>

        {/* User Preview */}
        <div className="px-6 pb-4">
          <div className="bg-gray-50 rounded-lg border p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {userAvatar ? (
                  <Image 
                    className="h-10 w-10 rounded-full object-cover"
                    src={userAvatar} 
                    alt={userName}
                    width={40}
                    height={40}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 text-sm font-medium ${userAvatar ? 'hidden' : ''}`}>
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 mb-1">{userName}</p>
                <p className="text-xs text-gray-500 mb-2">{userEmail}</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  userStatus === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                  userStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {getStatusLabel(userStatus)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="px-6 pb-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="flex-shrink-0 h-5 w-5 text-amber-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-amber-800 font-medium">
                Esta ação é <strong>irreversível</strong>. Todos os dados serão perdidos permanentemente.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
              isDeleting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 hover:shadow-md"
            }`}
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Excluindo...
              </>
            ) : (
              "Excluir usuário"
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
