import { Metadata } from "next";
import { ReactNode } from "react";

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
      <body className={` text-primary`}>
        <div>Hello there</div>
      </body>
    </html>
  );
}
