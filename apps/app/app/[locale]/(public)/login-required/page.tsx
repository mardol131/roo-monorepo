import Button from "@/app/components/ui/atoms/button";
import LoginButton from "./components/login-button";
import { getServerUser } from "@/app/functions/auth/get-server-user";
import { redirect } from "@/app/i18n/navigation";
import { getLocale } from "next-intl/server";

export default async function LoginRequiredPage() {
  const user = await getServerUser();
  const locale = await getLocale();
  if (user) {
    return redirect({
      href: "/homepage",
      locale: locale,
    });
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Nejste přihlášeni</h1>
        <p className="text-muted-foreground max-w-sm text-sm">
          Pro přístup na tuto stránku se musíte přihlásit ke svému účtu.
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          version="plain"
          text="Přejít na hlavní stránku"
          link={{ pathname: "/homepage" }}
        />
        <LoginButton />
      </div>
    </div>
  );
}
