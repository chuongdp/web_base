import type { NextAuthConfig } from "next-auth";

/** Providers thật (Credentials + DB) gắn trong `auth.ts`. Middleware dùng `auth-edge.ts` (providers rỗng). */
export const authConfig = {
  providers: [],
  /** Bắt buộc production; dev có fallback nếu chưa set AUTH_SECRET trong .env */
  secret:
    process.env.AUTH_SECRET ??
    (process.env.NODE_ENV !== "production"
      ? "local-dev-auth-secret-do-not-use-in-production-32chars"
      : undefined),
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  trustHost: true,
  callbacks: {
    authorized({ auth, request }) {
      if (request.nextUrl.pathname.startsWith("/admin")) {
        return !!auth?.user;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
