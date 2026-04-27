import RegisterForm from "@/app/components/forms/register-form";
import Text from "@/app/components/ui/atoms/text";
import { Link } from "@/app/i18n/navigation";
import { CalendarCheck, MessageSquare, Search } from "lucide-react";
const image = "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f";
const PERKS = [
  {
    icon: Search,
    title: "Najděte ideální místo",
    description: "Prohledávejte stovky prostorů a služeb pro vaši akci.",
  },
  {
    icon: MessageSquare,
    title: "Komunikujte přímo",
    description: "Vše vyřídíte v jednom chatu bez zbytečných e-mailů.",
  },
  {
    icon: CalendarCheck,
    title: "Sledujte poptávky",
    description: "Přehledný přehled všech vašich rezervací na jednom místě.",
  },
];

export default function RegisterPage() {
  return (
    <main className="flex min-h-[80vh]">
      {/* ── Left — form ─────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col justify-center items-center px-6 py-10 bg-white">
        <div className="w-full max-w-md flex flex-col">
          {/* Brand */}

          <div className="mb-7">
            <Text variant="h2" color="textDark">
              Vytvořit účet
            </Text>
            <Text variant="body-sm" color="textLight" className="mt-1">
              Zaregistrujte se a začněte používat roo.
            </Text>
          </div>

          <RegisterForm accountType="user" buttonVersion="primary" />

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
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-secondary  via-zinc-900/85 to-zinc-800/60" />

        <div className="w-full items-center justify-center flex">
          <div className="max-w-sm relative z-10">
            <Text variant="display-lg" color="white" className="leading-tight">
              Vše pro vaši akci na jednom místě.
            </Text>
            <Text variant="body" color="white" className="mt-4 opacity-90">
              roo propojuje pořadatele akcí s prostory, catering službami a
              dalšími dodavateli — jednoduše a přehledně.
            </Text>

            <div className="mt-12 flex flex-col gap-8">
              {PERKS.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <Text variant="label-lg" color="white">
                      {title}
                    </Text>
                    <Text
                      variant="body-sm"
                      color="white"
                      className="mt-0.5 opacity-90"
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
