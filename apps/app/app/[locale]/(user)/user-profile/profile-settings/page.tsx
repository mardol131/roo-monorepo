import { AccountSettingsSection } from "../../components/account-settings-section";
import PageHeading from "../../components/page-heading";

export default function page() {
  return (
    <main className="w-full pb-20">
      <PageHeading
        heading="Nastavení profilu"
        description="Zde můžete upravit nastavení svého profilu a spravovat své informace."
      />
      <div className="flex flex-col gap-4 mt-6">
        <AccountSettingsSection />
      </div>
    </main>
  );
}
