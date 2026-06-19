"use client";

import React, { PropsWithChildren } from "react";
import { AlertTriangle, CheckCircle, X } from "lucide-react";
import Text from "../atoms/text";
import { AlertSection } from "./alert-section";

interface ModalLayoutProps extends PropsWithChildren {
  header: string | React.ReactNode;
  onClose: () => void;
  isOpen?: boolean;
  maxWidth?: string;
  disableClose?: boolean;
  errorMessages?: string[];
  infoMessages?: string[];
  successMessages?: string[];
}

export default function ModalLayout({
  header,
  onClose,
  children,
  isOpen,
  maxWidth = "max-w-2xl",
  disableClose = false,
  errorMessages,
  infoMessages,
  successMessages,
}: ModalLayoutProps) {
  if (!isOpen) return null;

  const handleClose = () => {
    if (!disableClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100">
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
          <div className="flex items-start justify-between p-6 border-b border-zinc-200">
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
        </div>
        {infoMessages &&
          infoMessages.length > 0 &&
          infoMessages.map((message, index) => (
            <div key={index} className="px-6 py-3">
              <AlertSection
                icon={AlertTriangle}
                iconBg="bg-warning-surface"
                iconColor="text-warning"
                borderColor="border-warning"
                title={message}
                text=""
                bgColor="bg-warning-surface"
              />
            </div>
          ))}
        {successMessages &&
          successMessages.length > 0 &&
          successMessages.map((message, index) => (
            <div key={index} className="px-6 py-3">
              <AlertSection
                icon={CheckCircle}
                iconBg="bg-success-surface"
                iconColor="text-success"
                borderColor="border-success"
                title={message}
                text=""
                bgColor="bg-success-surface"
              />
            </div>
          ))}
        {errorMessages &&
          errorMessages.length > 0 &&
          errorMessages.map((message, index) => (
            <div key={index} className="px-6 py-3">
              <AlertSection
                icon={AlertTriangle}
                iconBg="bg-danger-surface"
                iconColor="text-danger"
                borderColor="border-danger"
                title={message}
                text=""
                bgColor="bg-danger-surface"
              />
            </div>
          ))}

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
