import { Metadata } from "next";
import { ReactNode } from "react";
import "./styles/global.css";
import Header from "./components/layout/header/header";
import Footer from "./components/layout/footer";

export const metadata: Metadata = {};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="cs">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`text-textDark`}>
        <Header />
        <div className="pt-30">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
