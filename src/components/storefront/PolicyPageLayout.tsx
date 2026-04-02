import type { ReactNode } from "react";

type Props = {
  title: string;
  lastUpdated?: string;
  children: ReactNode;
};

export function PolicyPageLayout({ title, lastUpdated, children }: Props) {
  return (
    <article className="mx-auto max-w-3xl space-y-8 pb-4">
      <header>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">{title}</h1>
        {lastUpdated ? <p className="mt-2 text-sm text-zinc-500">Last updated: {lastUpdated}</p> : null}
      </header>
      <div className="space-y-4 text-sm leading-relaxed text-zinc-700 [&_h2]:mt-8 [&_h2]:scroll-mt-24 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-zinc-900 [&_h2]:first:mt-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-1">
        {children}
      </div>
    </article>
  );
}
