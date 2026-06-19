"use client";

import Button from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import ModalLayout from "@/app/components/ui/molecules/modal-layout";

interface Props {
  isOpen: boolean;
  onContinue: () => void;
  onStartFresh: () => void;
}

export default function ResumeDraftModal({
  isOpen,
  onContinue,
  onStartFresh,
}: Props) {
  return (
    <ModalLayout
      header="Rozdělaná poptávka"
      isOpen={isOpen}
      onClose={onContinue}
      maxWidth="max-w-sm"
    >
      <div className="flex flex-col gap-5">
        <Text variant="body" color="secondary">
          Máte rozdělanou poptávku pro tento inzerát. Chcete v ní pokračovat,
          nebo začít znovu?
        </Text>
        <div className="flex justify-end gap-3">
          <Button
            htmlType="button"
            text="Začít znovu"
            version="outlined"
            onClick={onStartFresh}
          />
          <Button
            htmlType="button"
            text="Pokračovat"
            version="primary"
            onClick={onContinue}
          />
        </div>
      </div>
    </ModalLayout>
  );
}
