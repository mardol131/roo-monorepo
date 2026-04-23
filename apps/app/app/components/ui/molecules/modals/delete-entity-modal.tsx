import React from "react";
import ModalLayout from "../modal-layout";
import { Trash2, X } from "lucide-react";
import Text from "../../atoms/text";
import Input from "../../atoms/inputs/input";
import Button from "../../atoms/button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onDeleteConfirmClick: () => Promise<void>;
  isDeleting?: boolean;
  deletePhrase?: string;
  whatIsGoingToHappenList: string[];
};

export default function DeleteEntityModal({
  isOpen,
  onClose,
  onDeleteConfirmClick,
  isDeleting,
  deletePhrase = "souhlasím",
  whatIsGoingToHappenList,
}: Props) {
  const [deleteConfirmText, setDeleteConfirmText] = React.useState("");

  return (
    <ModalLayout
      header={
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-red-100 shrink-0">
            <Trash2 className="w-4.5 h-4.5 text-red-600" />
          </div>
          <div>
            <Text variant="h4" color="textDark">
              Opravdu chcete smazat tuto položku?
            </Text>
            <Text variant="caption" color="secondary">
              Tato akce je nevratná
            </Text>
          </div>
        </div>
      }
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setDeleteConfirmText("");
      }}
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col gap-1.5">
          <Text variant="label-lg" color="textDark">
            Co se stane po smazání:
          </Text>
          <ul className="flex flex-col gap-1">
            {whatIsGoingToHappenList.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <X className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                <Text variant="body-sm" color="textDark">
                  {item}
                </Text>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-1.5">
          <Text variant="label-lg" color="textDark">
            Pro potvrzení napište:{" "}
            <span className="font-mono text-red-600">{deletePhrase}</span>
          </Text>
          <Input
            label=""
            inputProps={{
              value: deleteConfirmText,
              onChange: (e) => setDeleteConfirmText(e.target.value),
              placeholder: deletePhrase,
            }}
          />
        </div>
        <Button
          text="Trvale smazat položku"
          version="primary"
          iconLeft="Trash2"
          disabled={
            deleteConfirmText.trim().toLowerCase() !==
              deletePhrase.toLowerCase() || isDeleting
          }
          onClick={onDeleteConfirmClick}
          className="w-full bg-red-600 hover:bg-red-700 border-red-600"
        />
      </div>
    </ModalLayout>
  );
}
