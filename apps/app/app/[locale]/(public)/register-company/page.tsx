import RegisterForm from "@/app/components/forms/register-form";
import Text from "@/app/components/ui/atoms/text";
import { Link } from "@/app/i18n/navigation";
import { BadgeCheck, Building2, Zap } from "lucide-react";

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

export default function RegisterCompanyPage() {
  return (
    <main className=" flex">
      {/* ── Left — form ─────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col justify-center items-center px-6 py-10 bg-white">
        <div className="w-full max-w-md flex flex-col">
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

          <div className="mt-6 flex items-start gap-2">
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
              <Link href="/homepage" className="underline hover:text-zinc-700">
                podmínkami použití
              </Link>{" "}
              a{" "}
              <Link href="/homepage" className="underline hover:text-zinc-700">
                zásadami ochrany osobních údajů
              </Link>
              .
            </Text>
          </div>
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
        {/* Dark gradient overlay — company tones */}
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
