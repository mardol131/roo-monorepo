import { Metadata } from "next";
import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import "./styles/global.css";
import { ReactQueryProvider } from "./react-query/react-query-provider";
import { ConfirmActionModal } from "./components/ui/molecules/modals/confirm-action-modal";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { favouriteListingKeys } from "./react-query/query-keys";
import { fetchFavouriteListings } from "./react-query/favourite-listings/fetch";
import LoginModal from "./components/ui/molecules/modals/login-modal/login-modal";
import { AuthProvider } from "./context/auth/auth-context";

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
                <ConfirmActionModal />
                <LoginModal />
              </HydrationBoundary>
            </AuthProvider>
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
