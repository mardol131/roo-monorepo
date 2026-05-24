import Button from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import { verifyUsersEmail } from "@/app/functions/api/users";

type Props = {
  searchParams: Promise<{
    emailVerificationToken?: string;
    redirectTo?: string;
  }>;
};

export default async function UserVerificationPage({ searchParams }: Props) {
  const { emailVerificationToken, redirectTo } = await searchParams;

  if (!emailVerificationToken) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">Neplatný odkaz</h1>
          <p className="text-muted-foreground max-w-sm text-sm">
            Ověřovací odkaz je neplatný. Zkuste se znovu zaregistrovat.
          </p>
        </div>
        <Button
          version="primary"
          text="Zpět na registraci"
          link={{ pathname: "/register" }}
        />
      </div>
    );
  }
  console.log("redirectTo", redirectTo);

  const res = await verifyUsersEmail(emailVerificationToken);

  console.log(res);

  if (res.ok) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="flex flex-col gap-2">
          <Text variant="h1">Účet byl ověřen</Text>
          <Text variant="body" color="textLight">
            {redirectTo
              ? "Váš účet byl úspěšně ověřen. Kliknutím níže pokračujte na původně zamýšlenou stránku."
              : "Váš účet byl úspěšně ověřen. Nyní se můžete přihlásit a začít používat roo."}
          </Text>
        </div>
        {redirectTo ? (
          <a href={redirectTo}>
            <Button version="primary" text="Pokračovat" />
          </a>
        ) : (
          <Button
            version="primary"
            text="Přejít na přihlášení"
            link={{ pathname: "/login" }}
          />
        )}
      </div>
    );
  }

  const isExpired = res.status === 400;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">
          {isExpired ? "Odkaz vypršel" : "Ověření se nezdařilo"}
        </h1>
        <p className="text-muted-foreground max-w-sm text-sm">
          {isExpired
            ? "Platnost ověřovacího odkazu vypršela. Přihlaste se a nechte si zaslat nový."
            : "Něco se pokazilo. Zkuste to prosím znovu nebo kontaktujte podporu."}
        </p>
      </div>
      <Button
        version="primary"
        text="Přejít na přihlášení"
        link={{ pathname: "/login" }}
      />
    </div>
  );
}
