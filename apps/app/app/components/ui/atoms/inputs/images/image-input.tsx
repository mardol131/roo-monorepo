"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import Text from "../../text";
import ErrorText from "../error-text";
import { convertAndUploadImage, useFileDragDrop, useFileInput } from "./utils";
import InputLabel from "../../input-label";

type ImageInputProps = {
  label: string;
  value?: string | null;
  onChange: (filename: string | null) => void;
  onUpload: (file: File) => Promise<string>;
  error?: string;
  isRequired?: boolean;
  accept?: string;
};

export default function ImageInput({
  label,
  value,
  onChange,
  onUpload,
  error,
  isRequired,
  accept = "image/*",
}: ImageInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value ?? null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File | null) => {
      if (!file) {
        setPreview(null);
        onChange(null);
        return;
      }

      if (!file.type.startsWith("image/")) return;

      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setUploadError(null);
      setIsUploading(true);

      try {
        const filename = await convertAndUploadImage(file, onUpload);
        URL.revokeObjectURL(objectUrl);
        setPreview(filename);
        onChange(filename);
      } catch {
        URL.revokeObjectURL(objectUrl);
        setPreview(null);
        setUploadError("Nahrávání se nezdařilo. Zkuste to znovu.");
        onChange(null);
      } finally {
        setIsUploading(false);
      }
    },
    [onChange, onUpload],
  );

  const handleFiles = useCallback(
    (files: FileList) => {
      handleFile(files[0] ?? null);
    },
    [handleFile],
  );

  const { isDragging, handleDragOver, handleDragLeave, handleDrop } =
    useFileDragDrop(handleFiles);
  const { fileInputProps, handleClick } = useFileInput(handleFiles, { accept });

  const handleRemove = useCallback(() => {
    setPreview(null);
    setUploadError(null);
    onChange(null);
  }, [onChange]);

  return (
    <div>
      <InputLabel label={label} isRequired={isRequired} />

      <input {...fileInputProps} />

      {preview ? (
        <div
          className={`relative w-full overflow-hidden rounded-lg border ${error ? "border-red-500" : "border-zinc-300"}`}
        >
          <Image
            src={preview}
            alt={label}
            width={400}
            height={200}
            className="h-48 w-full object-cover"
          />
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60">
              <Loader2 size={28} className="animate-spin text-zinc-600" />
            </div>
          )}
          {!isUploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900/60 text-white transition-colors hover:bg-zinc-900/80"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              handleClick();
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-3 py-8 transition-colors ${
            isDragging
              ? "border-zinc-900 bg-zinc-50"
              : error
                ? "border-red-500 bg-white"
                : "border-zinc-300 bg-white hover:border-zinc-400 hover:bg-zinc-50"
          } focus:border-transparent focus:outline-none focus:ring-2 focus:ring-zinc-900`}
        >
          <ImagePlus size={28} className="text-zinc-400" />
          <Text variant="label" color="textLight" className="text-center">
            Přetáhněte obrázek nebo klikněte pro nahrání
          </Text>
        </div>
      )}

      {(error || uploadError) && (
        <ErrorText error={error ?? uploadError ?? undefined} />
      )}
    </div>
  );
}
