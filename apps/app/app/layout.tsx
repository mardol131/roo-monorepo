import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";
import { AuthProvider } from "./context/auth/auth-context";
import { fetchFavouriteListings } from "./react-query/favourite-listings/fetch";
import { favouriteListingKeys } from "./react-query/query-keys";
import { ReactQueryProvider } from "./react-query/react-query-provider";
import "./styles/global.css";

export const metadata: Metadata = {};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: favouriteListingKeys.all(),
    queryFn: () => fetchFavouriteListings(),
  });

  return (
    <html lang="cs">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`text-on-dark`}>
        <NextIntlClientProvider>
          <ReactQueryProvider>
            <AuthProvider>
              <HydrationBoundary state={dehydrate(queryClient)}>
                {children}
              </HydrationBoundary>
            </AuthProvider>
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
