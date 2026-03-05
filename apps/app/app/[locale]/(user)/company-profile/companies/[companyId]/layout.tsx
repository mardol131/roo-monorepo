import CompanySidebar from "../../../components/sub-sidebar";

type Props = {
  children: React.ReactNode;
  params: Promise<{ companyId: string }>;
};

export default async function Layout({ children, params }: Props) {
  const { companyId } = await params;

  return (
    <>
      <CompanySidebar companyId={companyId} />
      <div className="flex-1 flex justify-center">
        <div className="max-w-4xl w-full flex flex-col px-8 py-10">
          {children}
        </div>
      </div>
    </>
  );
}
