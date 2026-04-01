import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
  /** Bắt buộc production; dev có fallback nếu chưa set AUTH_SECRET trong .env */
  secret:
    process.env.AUTH_SECRET ??
    (process.env.NODE_ENV !== "production"
      ? "local-dev-auth-secret-do-not-use-in-production-32chars"
      : undefined),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mật khẩu", type: "password" },
      },
      authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") return null;

        /** Tài khoản tĩnh (test local). Không đọc DB. */
        const ADMIN_EMAIL = "admin@local.com";
        const ADMIN_PASSWORD = "123456";

        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          return { id: "admin", name: "Admin", email: ADMIN_EMAIL };
        }
        return null;
      },
    }),
  ],
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
