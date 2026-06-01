"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import { ImageIcon, ImagePlus, Loader2, Trash2 } from "lucide-react";
import Text from "../../text";
import ErrorText from "../error-text";
import { convertAndUploadImage, useFileDragDrop, useFileInput } from "./utils";
import InputLabel from "../../input-label";
import { generateMediaUrl } from "@/app/functions/generate-media-url";
import { MediaSchema } from "@roo/common";
import Button from "../../button";
import { userImagesGalleryModalEvents } from "../../../molecules/modals/user-images-gallery-modal";

type ImageInputProps = {
  label: string;
  sublabel?: string;
  value?: MediaSchema | null;
  onChange: (media: MediaSchema | null) => void;
  onUpload: (file: File) => Promise<MediaSchema>;
  onGalleryButtonClick?: () => void;
  error?: string;
  isRequired?: boolean;
  accept?: string;
  containerRef?: React.Ref<HTMLDivElement>;
};

export function isDisplayableUrl(url: string) {
  if (url.startsWith("blob:") || url.startsWith("data:")) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function ImageInput({
  label,
  sublabel,
  value,
  onChange,
  onUpload,
  error,
  isRequired,
  accept = "image/*",
  containerRef,
  onGalleryButtonClick,
}: ImageInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File | null) => {
      if (!file) {
        onChange(null);
        return;
      }

      if (!file.type.startsWith("image/")) return;

      setUploadError(null);
      setIsUploading(true);

      try {
        const media = await convertAndUploadImage(file, onUpload);
        setUploadPreview(generateMediaUrl(media.filename || ""));
        onChange(media);
      } catch {
        setUploadPreview(null);
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
    setUploadError(null);
    setUploadPreview(null);
    onChange(null);
  }, [onChange]);

  const displayUrl =
    uploadPreview ??
    (value && value && isDisplayableUrl(generateMediaUrl(value.filename || ""))
      ? generateMediaUrl(value.filename || "")
      : null);
  const hasValue = isUploading || !!value?.filename;

  const galleryButtonHandler = useCallback(() => {
    if (onGalleryButtonClick) onGalleryButtonClick();
    userImagesGalleryModalEvents.emit("open", {
      onMediaClick: (media) => {
        const mediaUrl = generateMediaUrl(media.filename || "");
        if (!isDisplayableUrl(mediaUrl)) {
          setUploadError("Vybraný obrázek nelze zobrazit.");
          return;
        }
        onChange(media);
      },
    });
  }, [onGalleryButtonClick]);

  return (
    <div ref={containerRef} tabIndex={-1}>
      <InputLabel label={label} sublabel={sublabel} isRequired={isRequired} />

      <input {...fileInputProps} />

      {hasValue ? (
        <div
          className={`relative w-full overflow-hidden rounded-lg border ${error ? "border-danger" : "border-zinc-300"}`}
        >
          {displayUrl ? (
            <Image
              src={displayUrl}
              alt={label}
              width={400}
              height={200}
              className="h-48 w-full object-cover"
            />
          ) : (
            <div className="flex h-48 w-full items-center justify-center gap-2 bg-zinc-100">
              <ImageIcon size={24} className="text-zinc-400" />
              <Text variant="label" color="textLight">
                Obrázek
              </Text>
            </div>
          )}
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
        <UploadImageItem
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          isDragging={isDragging}
          error={error}
          onGalleryButtonClick={galleryButtonHandler}
        />
      )}

      {(error || uploadError) && (
        <ErrorText error={error ?? uploadError ?? undefined} />
      )}
    </div>
  );
}

export function UploadImageItem({
  onClick,
  onDragOver,
  onDragLeave,
  onDrop,
  onGalleryButtonClick,
  isDragging,
  error,
}: {
  onClick: () => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  isDragging: boolean;
  onGalleryButtonClick?: () => void;
  error?: string;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`flex relative w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-3 py-10 transition-colors ${
        isDragging
          ? "border-zinc-900 bg-zinc-50"
          : error
            ? "border-danger bg-white"
            : "border-zinc-300 bg-white hover:border-zinc-400 hover:bg-zinc-50"
      } focus:border-transparent focus:outline-none focus:ring-2 focus:ring-zinc-900`}
    >
      {onGalleryButtonClick && (
        <div
          className="absolute top-2 right-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            text="Otevřít galerii"
            size="xs"
            version="outlined"
            onClick={onGalleryButtonClick}
          />
        </div>
      )}
      <ImagePlus size={28} className="text-zinc-400" />
      <Text variant="label" color="textLight" className="text-center">
        Přetáhněte obrázek nebo klikněte pro nahrání
      </Text>
    </div>
  );
}
