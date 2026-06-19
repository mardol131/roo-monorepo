import { envConfig } from "@/app/server";
import { signInWithOAuth } from "@/app/functions/auth/sign-in-with-oauth";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: envConfig.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: envConfig.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (
        account?.provider !== "google" ||
        !account.id_token ||
        !profile?.email
      ) {
        return false;
      }

      return signInWithOAuth({ provider: "google", idToken: account.id_token });
    },
  },
});

export { handler as GET, handler as POST };
