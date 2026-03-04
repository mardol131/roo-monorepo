import Footer from "@/app/components/layout/footer";
import Header from "@/app/components/layout/header/header";
import { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
