"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  isVisible: boolean;
  isRemoving: boolean;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    // Start removal animation
    setToasts(prev => 
      prev.map(toast => 
        toast.id === id ? { ...toast, isRemoving: true } : toast
      )
    );
    
    // Remove from DOM after animation completes
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 300);
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { 
      id, 
      message, 
      type, 
      isVisible: false, 
      isRemoving: false 
    };
    
    setToasts(prev => [...prev, newToast]);
    
    // Trigger entrance animation after DOM update
    setTimeout(() => {
      setToasts(prev => 
        prev.map(toast => 
          toast.id === id ? { ...toast, isVisible: true } : toast
        )
      );
    }, 50);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container with Advanced Positioning */}
      <div className="toast-container fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full sm:max-w-sm">
        {toasts.map((toast, index) => (
          <ToastComponent
            key={toast.id}
            toast={toast}
            index={index}
            onRemove={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

interface ToastComponentProps {
  toast: Toast;
  index: number;
  onRemove: () => void;
}

function ToastComponent({ toast, index, onRemove }: ToastComponentProps) {
  const [isPaused, setIsPaused] = useState(false);

  // Stacking effect calculation
  const stackOffset = index * 8;
  const scaleStack = 1 - (index * 0.05);
  
  // Dynamic styles based on state
  const getToastStyles = () => {
    let baseClasses = "toast-transition relative p-4 rounded-lg shadow-lg transition-all duration-300 ease-out cursor-pointer border backdrop-blur-sm";
    
    // Color schemes by type with premium gradients
    const colorSchemes = {
      success: "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-400 shadow-emerald-500/20",
      error: "bg-gradient-to-r from-red-500 to-rose-600 text-white border-red-400 shadow-red-500/20",
      warning: "bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-400 shadow-amber-500/20",
      info: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-400 shadow-blue-500/20"
    };

    baseClasses += ` ${colorSchemes[toast.type]}`;

    // Animation states with smooth transitions
    if (!toast.isVisible) {
      // Initial state: off-screen to the right
      baseClasses += " translate-x-full opacity-0 scale-95";
    } else if (toast.isRemoving) {
      // Removing state: fade out and slide right with animation class
      baseClasses += " animate-fade-out";
    } else {
      // Visible state: slide in with bounce effect
      baseClasses += " translate-x-0 opacity-100 scale-100 animate-bounce-in";
    }

    // Hover effect to enhance interaction
    if (isPaused) {
      baseClasses += " toast-hover scale-105 shadow-2xl";
    }

    return baseClasses;
  };

  const getStackingStyles = () => {
    if (index === 0) return {};
    
    return {
      transform: `translateY(-${stackOffset}px) scale(${scaleStack})`,
      zIndex: 50 - index,
      filter: `brightness(${1 - (index * 0.1)})`, // Subtle darkening for depth
    };
  };

  return (
    <div
      className={getToastStyles()}
      style={getStackingStyles()}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Icon with bounce animation */}
          <div className="animate-bounce-icon mr-3">
            {toast.type === "success" && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            {toast.type === "error" && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L10 10.586l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            {toast.type === "warning" && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {toast.type === "info" && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
        
        {/* Close button with hover effect */}
        <button
          onClick={onRemove}
          className="ml-4 text-white hover:text-gray-200 transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Progress bar for auto-remove timer with enhanced styling */}
      {!toast.isRemoving && (
        <div className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-20 rounded-b-lg overflow-hidden">
          <div 
            className={`h-full bg-white bg-opacity-90 transition-all ease-linear animate-progress ${isPaused ? 'animate-pause' : ''}`}
            style={{ 
              animationDuration: isPaused ? 'paused' : '4s',
              animationPlayState: isPaused ? 'paused' : 'running'
            }}
          />
        </div>
      )}
    </div>
  );
}