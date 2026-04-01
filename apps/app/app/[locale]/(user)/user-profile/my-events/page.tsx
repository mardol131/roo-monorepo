import PageHeading from "../../components/page-heading";
import { MOCK_EVENTS } from "../_mock/mock-data";
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
          version: "primary",
          iconRight: "Plus",
          link: "/user-profile/new-event",
        }}
      />

      <PageContent items={MOCK_EVENTS} />
    </main>
  );
}
