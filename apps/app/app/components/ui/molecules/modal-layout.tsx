"use client";

import React, { PropsWithChildren } from "react";
import { X } from "lucide-react";
import Text from "../atoms/text";

interface ModalLayoutProps extends PropsWithChildren {
  header: string | React.ReactNode;
  onClose: () => void;
  isOpen?: boolean;
  maxWidth?: string;
  disableClose?: boolean;
  errorMessage?: string;
}

export default function ModalLayout({
  header,
  onClose,
  children,
  isOpen,
  maxWidth = "max-w-2xl",
  disableClose = false,
  errorMessage,
}: ModalLayoutProps) {
  if (!isOpen) return null;

  const handleClose = () => {
    if (!disableClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        onClick={handleClose}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Escape") handleClose();
        }}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-lg shadow-xl z-50 w-full mx-4 ${maxWidth} ${isOpen ? "animate-fadeIn" : "animate-fadeOut"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between p-6 border-b border-zinc-200">
            {typeof header === "string" ? (
              <Text variant="h4" color="textDark">
                {header}
              </Text>
            ) : (
              header
            )}
            <button
              onClick={handleClose}
              disabled={disableClose}
              className="p-1 hover:bg-zinc-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Zavřít modal"
            >
              <X className="w-5 h-5 text-zinc-600 hover:text-zinc-900" />
            </button>
          </div>
          {errorMessage && (
            <div className="px-6 py-2">
              <Text variant="body-sm" color="danger">
                {errorMessage}
              </Text>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
