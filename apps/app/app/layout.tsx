import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { AuthProvider } from "./context/auth/auth-context";
import { ReactQueryProvider } from "./react-query/react-query-provider";
import NextAuthSessionProvider from "./providers/session-provider";
import "./styles/global.css";

export const metadata: Metadata = {};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="cs">
      <head>
        <script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="1d42a84d-2b81-477b-803a-cc8fef44822e"
          data-blockingmode="auto"
          type="text/javascript"
          suppressHydrationWarning
        ></script>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`text-on-dark`}>
        <NextAuthSessionProvider session={session}>
          <NextIntlClientProvider>
            <ReactQueryProvider>
              <AuthProvider>{children}</AuthProvider>
            </ReactQueryProvider>
          </NextIntlClientProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
