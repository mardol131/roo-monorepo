import Text from "@/app/components/ui/atoms/text";
import { Link } from "@/app/i18n/navigation";
import { Suspense } from "react";
import PasswordResetForm from "./components/password-reset-form";

export default function PasswordResetPage() {
  return (
    <main className="flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white rounded-2xl border border-zinc-200 shadow-sm px-8 py-10">
        <div className="mb-7">
          <Text variant="h2" color="textDark">
            Nové heslo
          </Text>
          <Text variant="body-sm" color="textLight" className="mt-1">
            Zadejte nové heslo pro váš účet.
          </Text>
        </div>

        <Suspense>
          <PasswordResetForm />
        </Suspense>
      </div>
    </main>
  );
}
