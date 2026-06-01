"use client";

import Text from "@/app/components/ui/atoms/text";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

function getPageItems(
  currentPage: number,
  totalPages: number,
): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items: (number | "...")[] = [1];
  const start = Math.max(2, currentPage - 2);
  const end = Math.min(totalPages - 1, currentPage + 2);

  if (start > 2) items.push("...");
  for (let i = start; i <= end; i++) items.push(i);
  if (end < totalPages - 1) items.push("...");
  items.push(totalPages);

  return items;
}

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const pages = getPageItems(currentPage, totalPages);
  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <div className="flex items-center justify-center gap-1">
      <PaginationButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isPrevDisabled}
        aria-label="Předchozí stránka"
      >
        <ChevronLeft className="w-4 h-4" />
      </PaginationButton>

      {pages.map((item, index) =>
        item === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="w-12 h-12 flex items-center justify-center"
          >
            <Text variant="label" color="textLight">
              ...
            </Text>
          </span>
        ) : (
          <PaginationButton
            key={item}
            onClick={() => onPageChange(item)}
            active={item === currentPage}
            aria-current={item === currentPage ? "page" : undefined}
          >
            <Text
              variant="body"
              color={item === currentPage ? "white" : "textDark"}
              className="font-semibold"
            >
              {item}
            </Text>
          </PaginationButton>
        ),
      )}

      <PaginationButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isNextDisabled}
        aria-label="Další stránka"
      >
        <ChevronRight className="w-4 h-4" />
      </PaginationButton>
    </div>
  );
}

interface PaginationButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: React.ReactNode;
}

function PaginationButton({
  active = false,
  disabled = false,
  children,
  className,
  ...props
}: PaginationButtonProps) {
  const base =
    "w-12 h-12 rounded-md shadow-sm border border-zinc-200 flex items-center justify-center transition-all";
  const variant = active
    ? "bg-primary text-white"
    : "text-text-dark bg-zinc-100 hover:bg-zinc-200";
  const disabledClass = disabled ? "opacity-40 pointer-events-none" : "";

  return (
    <button
      disabled={disabled}
      className={`${base} ${variant} ${disabledClass} ${className ?? ""}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
