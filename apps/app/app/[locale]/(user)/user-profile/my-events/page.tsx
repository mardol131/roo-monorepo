import { MOCK_EVENTS } from "../../../../_mock/mock";
import PageHeading from "../../components/page-heading";
import PageContent from "./content";

export default async function MyEventsPage() {
  return (
    <main className="w-full">
      {/* Header */}
      <PageHeading
        heading="Moje události"
        description="Přehled všech vašich událostí a jejich stav."
        button={{
          text: "Vytvořit událost",
          version: "eventFull",
          iconRight: "Plus",
          link: "/user-profile/new",
        }}
      />

      <PageContent items={MOCK_EVENTS} />
    </main>
  );
}
