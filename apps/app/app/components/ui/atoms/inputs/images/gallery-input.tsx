"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import { GripVertical, ImagePlus, Loader2, Trash2 } from "lucide-react";
import Text from "../../text";
import ErrorText from "../error-text";
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import {
  convertAndUploadImage,
  filterImageFiles,
  useFileDragDrop,
  useFileInput,
} from "./utils";
import InputLabel from "../../input-label";
import { MediaSchema } from "@roo/common";
import { generateMediaUrl } from "@/app/functions/generate-media-url";
import { isDisplayableUrl, UploadImageItem } from "./image-input";
import { userImagesGalleryModalEvents } from "../../../molecules/modals/user-images-gallery-modal";

type UploadingImage = {
  id: string;
  preview: string;
};

type SortableGalleryItemProps = {
  imageUrl: string;
  label: string;
  index: number;
  sortableId: string;
  hasError: boolean;
  onRemove: () => void;
};

function SortableGalleryItem({
  imageUrl,
  label,
  index,
  sortableId,
  hasError,
  onRemove,
}: SortableGalleryItemProps) {
  const { ref, isDragging, handleRef } = useSortable({
    id: sortableId,
    index,
  });

  return (
    <div
      ref={ref}
      className={`relative aspect-square overflow-hidden rounded-lg border ${
        hasError ? "border-danger" : "border-zinc-300"
      } ${isDragging ? "z-10 opacity-50" : ""}`}
    >
      <Image
        src={imageUrl}
        alt={`${label} ${index + 1}`}
        fill
        className="object-cover"
      />
      <button
        ref={handleRef}
        type="button"
        className="absolute top-1 left-1 flex h-6 w-6 cursor-grab items-center justify-center rounded-full bg-zinc-900/60 text-white transition-colors hover:bg-zinc-900/80 active:cursor-grabbing"
      >
        <GripVertical size={12} />
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900/60 text-white transition-colors hover:bg-zinc-900/80"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}

type GalleryInputProps = {
  label: string;
  value?: MediaSchema[];
  onChange: (media: MediaSchema[]) => void;
  onUpload: (file: File) => Promise<MediaSchema>;
  error?: string;
  isRequired?: boolean;
  accept?: string;
  maxImages?: number;
  containerRef?: React.Ref<HTMLDivElement>;
  onGalleryButtonClick?: () => void;
};

export default function GalleryInput({
  label,
  value = [],
  onChange,
  onUpload,
  error,
  isRequired,
  accept = "image/*",
  maxImages = 20,
  containerRef,
  onGalleryButtonClick,
}: GalleryInputProps) {
  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const canAddMore = value.length + uploadingImages.length < maxImages;

  const processFiles = useCallback(
    async (files: FileList) => {
      const imageFiles = filterImageFiles(files);
      if (imageFiles.length === 0) return;

      const slotsAvailable = maxImages - value.length - uploadingImages.length;
      const filesToProcess = imageFiles.slice(0, slotsAvailable);
      if (filesToProcess.length === 0) return;

      setUploadError(null);

      const newUploading: UploadingImage[] = filesToProcess.map(() => ({
        id: crypto.randomUUID(),
        preview: URL.createObjectURL(new Blob()),
      }));

      // Create real previews
      const uploadingWithPreviews: UploadingImage[] = filesToProcess.map(
        (file, idx) => ({
          id: newUploading[idx].id,
          preview: URL.createObjectURL(file),
        }),
      );

      setUploadingImages((prev) => [...prev, ...uploadingWithPreviews]);

      const uploadResults = await Promise.allSettled(
        filesToProcess.map(async (file, idx) => {
          const uploadedMedia = await convertAndUploadImage(file, onUpload);
          URL.revokeObjectURL(uploadingWithPreviews[idx].preview);
          return { id: uploadingWithPreviews[idx].id, media: uploadedMedia };
        }),
      );

      const successfulMedia: MediaSchema[] = [];

      for (const result of uploadResults) {
        if (result.status === "fulfilled") {
          successfulMedia.push(result.value.media);
        }
      }

      setUploadingImages((prev) =>
        prev.filter(
          (item) =>
            !uploadingWithPreviews.some(
              (uploading) => uploading.id === item.id,
            ),
        ),
      );

      if (successfulMedia.length > 0) {
        onChange([...value, ...successfulMedia]);
      }

      if (successfulMedia.length < filesToProcess.length) {
        setUploadError("Některé obrázky se nepodařilo nahrát.");
      }
    },
    [
      value.length,
      maxImages,
      onChange,
      onUpload,
      uploadingImages.length,
      value,
    ],
  );

  const handleRemove = useCallback(
    (indexToRemove: number) => {
      const newValue = value.filter((_, idx) => idx !== indexToRemove);
      onChange(newValue);
    },
    [onChange, value],
  );

  const { isDragging, handleDragOver, handleDragLeave, handleDrop } =
    useFileDragDrop(processFiles);
  const { fileInputProps, handleClick } = useFileInput(processFiles, {
    accept,
    multiple: true,
  });

  const handleSortEnd = useCallback(
    (event: {
      operation: {
        source: { id: string | number } | null;
        target: { id: string | number } | null;
      };
    }) => {
      const { source, target } = event.operation;
      if (!source || !target) return;

      const sourceIndex = value.findIndex(
        (item) => item.filename === String(source.id),
      );
      const targetIndex = value.findIndex(
        (item) => item.filename === String(target.id),
      );
      if (
        sourceIndex === -1 ||
        targetIndex === -1 ||
        sourceIndex === targetIndex
      )
        return;

      const newValue = [...value];
      const [moved] = newValue.splice(sourceIndex, 1);
      newValue.splice(targetIndex, 0, moved);
      onChange(newValue);
    },
    [onChange, value],
  );

  const galleryButtonHandler = useCallback(() => {
    if (onGalleryButtonClick) onGalleryButtonClick();
    userImagesGalleryModalEvents.emit("open", {
      onMediaClick: (media) => {
        const mediaUrl = generateMediaUrl(media.filename || "");
        if (!isDisplayableUrl(mediaUrl)) {
          setUploadError("Vybraný obrázek nelze zobrazit.");
          return;
        }
        if (value.length < maxImages) {
          onChange([...value, media]);
        }
      },
    });
  }, [value, onChange, maxImages, onGalleryButtonClick]);

  return (
    <div ref={containerRef} tabIndex={-1}>
      <InputLabel label={label} isRequired={isRequired} />

      <input {...fileInputProps} />

      <DragDropProvider onDragEnd={handleSortEnd}>
        <div className="grid grid-cols-4 gap-2">
          {value.map((media, idx) => (
            <SortableGalleryItem
              key={`${media.filename}-${idx}`}
              sortableId={idx.toString()}
              imageUrl={generateMediaUrl(media.filename || "")}
              label={label}
              index={idx}
              hasError={false}
              onRemove={() => handleRemove(idx)}
            />
          ))}

          {uploadingImages.map((item) => (
            <div
              key={item.id}
              className="relative aspect-square overflow-hidden rounded-lg border border-zinc-300"
            >
              <Image
                src={item.preview}
                alt="Nahrávání..."
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                <Loader2 size={24} className="animate-spin text-zinc-600" />
              </div>
            </div>
          ))}

          {canAddMore && (
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
        </div>
      </DragDropProvider>

      {(error || uploadError) && (
        <ErrorText error={error ?? uploadError ?? undefined} />
      )}
    </div>
  );
}
