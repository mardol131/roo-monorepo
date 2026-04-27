"use client";

import RegisterForm from "@/app/components/forms/register-form";
import Button from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import { useAuth } from "@/app/context/auth/auth-context";
import { Link } from "@/app/i18n/navigation";
import { BadgeCheck, Building2, Zap } from "lucide-react";
import { useState } from "react";

const image = "https://images.unsplash.com/photo-1497366216548-37526070297c";

const PERKS = [
  {
    icon: Building2,
    title: "Prezentujte svou firmu",
    description:
      "Vytvořte firemní profil, přidejte služby a oslovte tisíce pořadatelů akcí.",
  },
  {
    icon: BadgeCheck,
    title: "Registrace i tvorba obsahu zdarma",
    description:
      "Vytvořit účet a plnit profil je zcela bezplatné. Platíte až za aktivaci konkrétní služby.",
  },
  {
    icon: Zap,
    title: "Poptávky rovnou do schránky",
    description:
      "Přijímejte poptávky, komunikujte s klienty a uzavírejte obchody — vše na jednom místě.",
  },
];

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

export default function RegisterCompanyPage() {
  const { user, isLoading, logout, refresh } = useAuth();
  const [isPending, setIsPending] = useState(false);
  const [switched, setSwitched] = useState(false);

  async function switchToCompany() {
    if (!user) return;
    setIsPending(true);
    try {
      await fetch(`${BASE_URL}/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ type: "company" }),
      });
      await refresh();
      setSwitched(true);
    } finally {
      setIsPending(false);
    }
  }

  const isCompany = user?.type === "company" || switched;

  return (
    <main className="flex min-h-[80vh]">
      {/* ── Left ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col justify-center items-center px-6 py-10 bg-white">
        <div className="w-full max-w-md flex flex-col">
          {isLoading ? (
            <div className="w-full h-48 rounded-2xl bg-zinc-100 animate-pulse" />
          ) : isCompany ? (
            <>
              <div className="w-12 h-12 rounded-2xl bg-company-surface flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6 text-company" />
              </div>
              <Text variant="h2" color="textDark">
                Váš účet je firemní
              </Text>
              <Text variant="body-sm" color="textLight" className="mt-2 mb-6">
                Máte aktivní firemní účet. Přejděte do firemního profilu a
                začněte spravovat své firmy a nabídky.
              </Text>
              <Link href={{ pathname: "/company-profile/companies" }}>
                <Button
                  text="Přejít do firemního profilu"
                  iconLeft="Building2"
                  version="companyFull"
                />
              </Link>
            </>
          ) : user ? (
            <>
              <div className="w-12 h-12 rounded-2xl bg-company-surface flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6 text-company" />
              </div>
              <Text variant="h2" color="textDark">
                Přepnout na firemní účet
              </Text>
              <Text variant="body-sm" color="textLight" className="mt-2 mb-6">
                Jste přihlášeni jako{" "}
                <Text
                  variant="body-sm"
                  color="textDark"
                  as="span"
                  className="font-medium"
                >
                  {user.firstName} {user.lastName}
                </Text>
                . Přepnutím na firemní účet získáte přístup ke správě firem,
                inzerci nabídek a příjmu poptávek.
              </Text>
              <Button
                text="Přepnout na firemní účet"
                iconLeft="Building2"
                version="companyFull"
                loading={isPending}
                disabled={isPending}
                onClick={switchToCompany}
              />
              <Text variant="caption" color="textLight" className="mt-4">
                Nejste{" "}
                <Text
                  variant="caption"
                  color="textDark"
                  as="span"
                  className="font-medium"
                >
                  {user.email}
                </Text>
                ?{" "}
                <button
                  type="button"
                  onClick={() => logout()}
                  className="underline hover:text-zinc-700 text-xs"
                >
                  Odhlásit se
                </button>
              </Text>
            </>
          ) : (
            <>
              <div className="mb-7">
                <Text variant="h2" color="textDark">
                  Registrace firmy
                </Text>
                <Text variant="body-sm" color="textLight" className="mt-1">
                  Zaregistrujte svou firmu a začněte získávat poptávky.
                </Text>
              </div>

              <RegisterForm
                accountType="company"
                buttonText="Zaregistrovat firmu"
                buttonIconLeft="Building2"
              />

              <div className="mt-6 flex items-center gap-2">
                <div className="flex-1 h-px bg-zinc-100" />
                <Text variant="caption" color="textLight">
                  nebo
                </Text>
                <div className="flex-1 h-px bg-zinc-100" />
              </div>

              <div className="mt-4 text-center">
                <Text variant="body-sm" color="textLight" as="span">
                  Již máte účet?{" "}
                </Text>
                <Link
                  href="/login"
                  className="text-sm font-medium text-zinc-900 hover:underline"
                >
                  Přihlaste se
                </Link>
              </div>

              <div className="mt-4 text-center">
                <Text variant="body-sm" color="textLight" as="span">
                  Registrujete se jako jednotlivec?{" "}
                </Text>
                <Link
                  href="/register"
                  className="text-sm font-medium text-zinc-900 hover:underline"
                >
                  Osobní registrace
                </Link>
              </div>

              <div className="mt-8">
                <Text variant="caption" color="textLight">
                  Registrací souhlasíte s{" "}
                  <Link
                    href="/homepage"
                    className="underline hover:text-zinc-700"
                  >
                    podmínkami použití
                  </Link>{" "}
                  a{" "}
                  <Link
                    href="/homepage"
                    className="underline hover:text-zinc-700"
                  >
                    zásadami ochrany osobních údajů
                  </Link>
                  .
                </Text>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Right — welcome panel ────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-1 flex-col justify-center px-16 py-10 text-white relative overflow-hidden"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-br from-zinc-900 via-zinc/80 to-company/70" />

        <div className="w-full flex items-center justify-center">
          <div className="max-w-sm relative z-10">
            <Text variant="display-lg" color="white" className="leading-tight">
              Získávejte klienty. Bez starostí.
            </Text>
            <Text variant="body" color="white" className="mt-4 opacity-80">
              roo propojuje vaši firmu s pořadateli akcí, kteří hledají přesně
              to, co nabízíte.
            </Text>

            <div className="mt-12 flex flex-col gap-8">
              {PERKS.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <Text variant="label-lg" color="white">
                      {title}
                    </Text>
                    <Text
                      variant="body-sm"
                      color="white"
                      className="mt-0.5 opacity-70"
                    >
                      {description}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
