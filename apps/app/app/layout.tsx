import { Metadata } from "next";
import { ReactNode } from "react";
import "./styles/global.css";
import { NextIntlClientProvider } from "next-intl";

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
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
