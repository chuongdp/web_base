import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

/** Chỉ dùng cho `middleware.ts` (Edge): không kéo Prisma/bcrypt. JWT cùng secret với `auth.ts`. */
export const { auth } = NextAuth(authConfig);
