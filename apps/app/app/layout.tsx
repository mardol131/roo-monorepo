import { Metadata } from "next";
import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import "./styles/global.css";
import { ReactQueryProvider } from "./react-query/react-query-provider";
import { ConfirmActionModal } from "./components/ui/molecules/modals/confirm-action-modal";

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
      <body className={`text-on-dark`}>
        <NextIntlClientProvider>
          <ReactQueryProvider>
            {children}
            <ConfirmActionModal />
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
