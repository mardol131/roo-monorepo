import Button from "@/app/components/ui/atoms/button";
import React from "react";

type Props = {
  showBackButton?: boolean;
  showNextButton?: boolean;
  nextButtonDisabled?: boolean;
  onBackClick?: () => void;
  onNextClick?: () => void;
  nextButtonText?: string;
  backButtonType?: "button" | "submit";
  nextButtonType?: "button" | "submit";
};

export default function ButtonSection({
  showBackButton,
  showNextButton,
  nextButtonDisabled,
  onBackClick,
  onNextClick,
  nextButtonText,
  backButtonType = "button",
  nextButtonType = "button",
}: Props) {
  return (
    <div className="px-6 py-5 bg-zinc-50 border rounded-xl mt-5 border-zinc-200 flex justify-between">
      {showBackButton && (
        <Button
          text="Zpět"
          version="secondary"
          size="md"
          iconLeft="ArrowLeft"
          htmlType={backButtonType}
          onClick={onBackClick}
        />
      )}
      {showNextButton && (
        <Button
          disabled={nextButtonDisabled}
          text={nextButtonText || "Pokračovat"}
          version="primary"
          size="md"
          iconRight="ArrowRight"
          htmlType={nextButtonType}
          onClick={onNextClick}
        />
      )}
    </div>
  );
}
