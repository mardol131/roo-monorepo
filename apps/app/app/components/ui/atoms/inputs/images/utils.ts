import React, { useCallback, useRef, useState } from "react";
import { convertImageToWebp } from "@roo/common";

// ── Shared hook: file drag & drop state ────────────────────────────────────────

export function useFileDragDrop(onFiles: (files: FileList) => void) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(true);
    },
    [],
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
    },
    [],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      if (event.dataTransfer.files?.length) {
        onFiles(event.dataTransfer.files);
      }
    },
    [onFiles],
  );

  return { isDragging, handleDragOver, handleDragLeave, handleDrop };
}

// ── Shared hook: hidden file input ─────────────────────────────────────────────

type UseFileInputOptions = {
  accept?: string;
  multiple?: boolean;
};

export function useFileInput(
  onFiles: (files: FileList) => void,
  options: UseFileInputOptions = {},
) {
  const { accept = "image/*", multiple = false } = options;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files?.length) {
        onFiles(event.target.files);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [onFiles],
  );

  const fileInputProps = {
    ref: fileInputRef,
    type: "file" as const,
    accept,
    multiple,
    onChange: handleInputChange,
    className: "hidden",
  };

  return { fileInputRef, handleClick, handleInputChange, fileInputProps };
}

// ── Shared utility: convert to webp & upload ───────────────────────────────────

export async function convertAndUploadImage(
  file: File,
  onUpload: (file: File) => Promise<string>,
): Promise<string> {
  const webpFile = await convertImageToWebp(file);
  return onUpload(webpFile);
}

// ── Shared utility: filter image files from FileList ───────────────────────────

export function filterImageFiles(files: FileList): File[] {
  return Array.from(files).filter((file) => file.type.startsWith("image/"));
}
