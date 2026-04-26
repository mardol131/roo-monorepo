import Text from "@/app/components/ui/atoms/text";
import { MailCheck } from "lucide-react";

type Props = {
  onBack: () => void;
};

export default function ForgotPasswordSuccessScreen({ onBack }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 py-4 text-center">
      <MailCheck className="w-14 h-14 text-success" strokeWidth={1.5} />
      <div className="flex flex-col gap-1">
        <Text variant="h3" color="textDark">
          Zkontrolujte svůj e-mail
        </Text>
        <Text variant="body-sm" color="textLight">
          Pokud zadaná adresa existuje v systému, přišel vám e-mail s odkazem
          pro obnovení hesla.
        </Text>
      </div>
      <button
        type="button"
        onClick={onBack}
        className="text-sm text-zinc-400 hover:text-zinc-700 hover:underline transition-colors mt-2"
      >
        Zpět na přihlášení
      </button>
    </div>
  );
}
