"use client";

import React, { PropsWithChildren } from "react";
import { X } from "lucide-react";
import Text from "../atoms/text";

interface ModalLayoutProps extends PropsWithChildren {
  header: string | React.ReactNode;
  onClose: () => void;
  isOpen?: boolean;
  maxWidth?: string;
}

export default function ModalLayout({
  header,
  onClose,
  children,
  isOpen,
  maxWidth = "max-w-2xl",
}: ModalLayoutProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-lg shadow-xl z-50 w-full mx-4 ${maxWidth} ${isOpen ? "animate-fadeIn" : "animate-fadeOut"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          {typeof header === "string" ? (
            <Text variant="heading5" color="dark">
              {header}
            </Text>
          ) : (
            header
          )}
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-100 rounded-lg transition-colors"
            aria-label="Zavřít modal"
          >
            <X className="w-5 h-5 text-zinc-600 hover:text-zinc-900" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
