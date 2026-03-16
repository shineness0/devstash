import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

export default {
  providers: [
    GitHub,
    Credentials({
      // Real authorize logic is in auth.ts (needs bcrypt, not edge-compatible)
      authorize: () => null,
    }),
  ],
} satisfies NextAuthConfig;
