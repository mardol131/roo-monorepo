import Button, { ButtonProps } from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import { ElementType } from "react";

type Props = {
  icon: ElementType;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  bgColor?: string;
  title: string;
  text?: string;
  button?: ButtonProps;
};

export function AlertSection({
  icon: Icon,
  iconBg,
  iconColor,
  borderColor,
  bgColor = "bg-white",
  title,
  text,
  button,
}: Props) {
  return (
    <div
      className={`${bgColor} rounded-2xl border ${borderColor} p-3 flex items-center gap-4`}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
      >
        <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
      </div>
      <div className="flex-1 flex flex-col gap-0.5">
        <Text variant="h4" color="textDark">
          {title}
        </Text>
        {text && (
          <Text variant="body-sm" color="secondary">
            {text}
          </Text>
        )}
      </div>
      {button && <Button {...button} />}
    </div>
  );
}
