import type { UserRole } from "@prisma/client";
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
      if (!request.nextUrl.pathname.startsWith("/admin")) {
        return true;
      }
      if (!auth?.user) {
        return false;
      }
      if (auth.user.role !== "ADMIN") {
        return Response.redirect(new URL("/", request.url));
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = (user as { id: string; role: UserRole }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = (token.role as UserRole) ?? "USER";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
