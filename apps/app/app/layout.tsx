import { Metadata } from "next";
import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import "./styles/global.css";
import { ReactQueryProvider } from "./react-query/react-query-provider";

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
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
