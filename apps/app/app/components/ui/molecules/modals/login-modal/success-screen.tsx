import Text from "@/app/components/ui/atoms/text";
import { MailCheck } from "lucide-react";
import Button from "../../../atoms/button";

type Props = {
  onBack: () => void;
  title: string;
  message: string;
  buttonText: string;
};

export default function SuccessScreen({
  onBack,
  title,
  message,
  buttonText,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-4 py-4 text-center">
      <MailCheck className="w-14 h-14 text-success" strokeWidth={1.5} />
      <div className="flex flex-col gap-1">
        <Text variant="h3" color="textDark">
          {title}
        </Text>
        <Text variant="body-sm" color="textLight">
          {message}
        </Text>
      </div>
      <Button
        text={buttonText}
        htmlType="button"
        version="plain"
        size="md"
        rounding="lg"
        className="w-full"
        onClick={onBack}
      />
    </div>
  );
}
