import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/db";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

const providers = [];

if (process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID) {
  providers.push(Google({
    clientId: process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET,
    allowDangerousEmailAccountLinking: true,
  }));
}

if (process.env.GITHUB_CLIENT_ID || process.env.AUTH_GITHUB_ID) {
  providers.push(GitHub({
    clientId: process.env.GITHUB_CLIENT_ID || process.env.AUTH_GITHUB_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET || process.env.AUTH_GITHUB_SECRET,
    allowDangerousEmailAccountLinking: true,
  }));
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // @ts-ignore
        session.user.role = user.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
