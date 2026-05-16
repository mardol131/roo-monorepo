"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
};

export default function ImageGallery({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) setActiveIndex(initialIndex);
  }, [isOpen, initialIndex]);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const next = useCallback(() => {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, prev, next]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed top-0 inset-0 z-50 flex flex-col bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex items-center justify-end p-4 shrink-0">
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 cursor-pointer"
        >
          <X size={24} />
        </button>
      </div>

      <div
        className="flex-1 flex flex-col md:flex-row items-center min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={prev}
          className="hidden md:flex shrink-0 text-white/70 hover:text-white transition-colors p-3 rounded-full hover:bg-white/10 cursor-pointer mx-2"
        >
          <ChevronLeft size={32} />
        </button>

        <div className="flex-1 min-h-0 w-full flex items-center justify-center p-4 md:p-20">
          <Image
            src={images[activeIndex]}
            alt={`Obrázek ${activeIndex + 1}`}
            width={3840}
            height={2160}
            className="max-w-full max-h-full w-auto h-auto"
            priority
          />
        </div>

        <button
          onClick={next}
          className="hidden md:flex shrink-0 text-white/70 hover:text-white transition-colors p-3 rounded-full hover:bg-white/10 cursor-pointer mx-2"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      <div
        className="shrink-0 flex md:hidden items-center justify-center gap-6 py-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={prev}
          className="text-white/70 hover:text-white transition-colors p-3 rounded-full hover:bg-white/10 cursor-pointer"
        >
          <ChevronLeft size={28} />
        </button>
        <span className="text-white/70 text-sm tabular-nums">
          {activeIndex + 1} / {images.length}
        </span>
        <button
          onClick={next}
          className="text-white/70 hover:text-white transition-colors p-3 rounded-full hover:bg-white/10 cursor-pointer"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      <div
        className="shrink-0 p-3 flex justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-2 overflow-x-auto max-w-full pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative w-16 h-16 shrink-0 rounded-md overflow-hidden cursor-pointer transition-all ${
                i === activeIndex
                  ? "ring-2 ring-white opacity-100"
                  : "opacity-50 hover:opacity-80"
              }`}
            >
              <Image
                src={src}
                alt={`Náhled ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
