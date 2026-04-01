"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";

function MagnifyingGlassIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

export function SearchBar() {
  const router = useRouter();
  const inputId = useId();
  const [keyword, setKeyword] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = keyword.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-lg">
      <label htmlFor={inputId} className="sr-only">
        Search products
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
          <MagnifyingGlassIcon className="h-5 w-5" />
        </span>
        <input
          id={inputId}
          type="text"
          name="q"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search for..."
          autoComplete="off"
          className="w-full rounded-full border-0 bg-gray-100 py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-black focus:ring-offset-0"
        />
      </div>
    </form>
  );
}
