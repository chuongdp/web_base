"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

function safePath(url: string): string {
  if (!url.startsWith("/") || url.startsWith("//")) return "/";
  return url;
}

function afterLoginPath(role: string, requested: string): string {
  const path = safePath(requested);
  if (role === "ADMIN") {
    if (path.startsWith("/admin")) return path;
    return "/admin/settings";
  }
  if (path.startsWith("/admin")) return "/";
  return path || "/";
}

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const registered = searchParams.get("registered") === "1";
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "").trim();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setPending(false);

    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    if (res?.ok) {
      const session = await getSession();
      const role = session?.user?.role ?? "USER";
      window.location.assign(afterLoginPath(role, callbackUrl));
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
      <h1 className="text-center text-xl font-semibold text-zinc-900">Sign in</h1>
      <p className="mt-1 text-center text-sm text-zinc-500">Sign in to your account</p>
      {registered ? (
        <p className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-center text-sm text-emerald-800">
          Account created. You can sign in now.
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-zinc-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-zinc-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-zinc-900 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-600">
        No account?{" "}
        <Link
          href="/login/register"
          className="font-medium text-zinc-900 underline underline-offset-2 hover:text-zinc-700"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-zinc-100 px-4">
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
