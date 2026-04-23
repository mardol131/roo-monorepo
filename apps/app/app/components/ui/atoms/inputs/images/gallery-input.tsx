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
        hasError ? "border-red-500" : "border-zinc-300"
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
  value?: string[];
  onChange: (urls: string[]) => void;
  onUpload: (file: File) => Promise<string>;
  error?: string;
  isRequired?: boolean;
  accept?: string;
  maxImages?: number;
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
          const uploadedUrl = await convertAndUploadImage(file, onUpload);
          URL.revokeObjectURL(uploadingWithPreviews[idx].preview);
          return { id: uploadingWithPreviews[idx].id, url: uploadedUrl };
        }),
      );

      const successfulUrls: string[] = [];

      for (const result of uploadResults) {
        if (result.status === "fulfilled") {
          successfulUrls.push(result.value.url);
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

      if (successfulUrls.length > 0) {
        onChange([...value, ...successfulUrls]);
      }

      if (successfulUrls.length < filesToProcess.length) {
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

      const sourceIndex = value.indexOf(String(source.id));
      const targetIndex = value.indexOf(String(target.id));
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

  return (
    <div>
      <InputLabel label={label} isRequired={isRequired} />

      <input {...fileInputProps} />

      <DragDropProvider onDragEnd={handleSortEnd}>
        <div className="grid grid-cols-4 gap-2">
          {value.map((url, idx) => (
            <SortableGalleryItem
              key={url}
              sortableId={url}
              imageUrl={url}
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
              className={`flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed transition-colors ${
                isDragging
                  ? "border-zinc-900 bg-zinc-50"
                  : error
                    ? "border-red-500 bg-white"
                    : "border-zinc-300 bg-white hover:border-zinc-400 hover:bg-zinc-50"
              } focus:border-transparent focus:outline-none focus:ring-2 focus:ring-zinc-900`}
            >
              <ImagePlus size={24} className="text-zinc-400" />
              <Text
                variant="caption"
                color="textLight"
                className="text-center px-1"
              >
                Nahrát
              </Text>
            </div>
          )}
        </div>
      </DragDropProvider>

      {(error || uploadError) && (
        <ErrorText error={error ?? uploadError ?? undefined} />
      )}
    </div>
  );
}
