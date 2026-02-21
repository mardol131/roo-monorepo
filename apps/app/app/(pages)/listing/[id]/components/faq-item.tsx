"use client";

import Text from "@/app/components/ui/atoms/text";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

type FAQItemProps = {
  question: string;
  answer: string;
};

export default function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="not-first:border-t border-zinc-200 overflow-hidden">
      <div
        className="flex items-center justify-between py-4 cursor-pointer"
        onClick={toggleOpen}
      >
        <Text variant="subheading2" className="font-semibold">
          {question}
        </Text>
        <ChevronDown
          className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          onClick={toggleOpen}
        />
      </div>

      {isOpen && (
        <Text variant="body5" color="dark" className="leading-relaxed">
          {answer}
        </Text>
      )}
    </div>
  );
}
