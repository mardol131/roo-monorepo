"use client";

import { generateMediaUrl } from "@/app/functions/generate-media-url";
import { createEvents } from "@/app/functions/create-events";
import {
  useUpdateUserMedia,
  useUsersMediaInfinite,
} from "@/app/react-query/user-medias/hooks";
import { UserMedia } from "@roo/common";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ModalLayout from "../modal-layout";
import { useAuth } from "@/app/context/auth/auth-context";

const LIMIT = 10;

type OpenPayload = {
  onMediaClick?: (media: UserMedia) => void;
  allowCloseOnMediaClick?: boolean;
  allowDelete?: boolean;
};

type UserImagesGalleryModalEvents = {
  open: OpenPayload;
};

export const userImagesGalleryModalEvents =
  createEvents<UserImagesGalleryModalEvents>();

export function UserImagesGalleryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [onMediaClick, setOnMediaClick] = useState<
    ((media: UserMedia) => void) | undefined
  >(undefined);
  const [closeOnMediaClick, setCloseOnMediaClick] = useState(false);
  const [allowDelete, setAllowDelete] = useState(false);
  const auth = useAuth();
  const sentinelRef = useRef<HTMLDivElement>(null);

  userImagesGalleryModalEvents.useListener({
    event: "open",
    handler: ({
      onMediaClick: cb,
      allowDelete: del = false,
      allowCloseOnMediaClick: close = true,
    }) => {
      setOnMediaClick(() => cb);
      setAllowDelete(del);
      setCloseOnMediaClick(close);
      setIsOpen(true);
    },
  });

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useUsersMediaInfinite({ limit: LIMIT, enabled: isOpen });

  const { mutate: updateMedia } = useUpdateUserMedia();

  useEffect(() => {
    if (isOpen) refetch();
  }, [isOpen]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    let el: HTMLElement | null = sentinel.parentElement;
    while (el) {
      const overflow = getComputedStyle(el).overflowY;
      if (overflow === "auto" || overflow === "scroll") break;
      el = el.parentElement;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: el, threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isOpen, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!auth.user || !isOpen) return null;

  const allMedia = data?.pages.flatMap((p) => p.docs ?? []) ?? [];

  function handleClose() {
    setIsOpen(false);
  }

  function handleSelect(media: UserMedia) {
    if (onMediaClick) {
      onMediaClick(media);
      if (closeOnMediaClick) {
        handleClose();
      }
    }
  }

  return (
    <ModalLayout
      header="Moje obrázky"
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="max-w-300"
    >
      {isLoading && (
        <p className="text-sm text-zinc-500 text-center py-8">Načítání…</p>
      )}
      {!isLoading && !allMedia.length && (
        <p className="text-sm text-zinc-500 text-center py-8">
          Zatím nemáte žádné nahrané obrázky.
        </p>
      )}
      {!!allMedia.length && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {allMedia.map((media) => (
            <div key={media.id} className="relative aspect-square">
              <button
                type="button"
                onClick={() => handleSelect(media)}
                className="absolute inset-0 rounded-lg overflow-hidden border border-zinc-200 hover:border-zinc-400 hover:ring-2 hover:ring-zinc-300 transition-all focus:outline-none focus:ring-2 focus:ring-zinc-400"
              >
                <Image
                  src={generateMediaUrl(
                    media.filename,
                    media.bucket ?? "listings-images",
                  )}
                  alt={media.alt ?? media.filename}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 33vw, 25vw"
                />
              </button>
              {allowDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateMedia({ id: media.id, data: { status: "archived" } });
                  }}
                  className="absolute top-1 right-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900/60 text-white transition-colors hover:bg-zinc-900/80"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      <div ref={sentinelRef} className="h-4" />
      {isFetchingNextPage && (
        <p className="text-sm text-zinc-500 text-center py-4">Načítání…</p>
      )}
    </ModalLayout>
  );
}
