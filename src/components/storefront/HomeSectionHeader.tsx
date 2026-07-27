import Link from "next/link";

type Props = {
  id?: string;
  eyebrow?: string | null;
  title: string;
  description?: string | null;
  action?: { href: string; label: string } | null;
  align?: "start" | "center";
  /** Bổ sung theo theme (font-bold, uppercase, text-rose-950, …). */
  titleClassName?: string;
};

export function HomeSectionHeader({
  id,
  eyebrow,
  title,
  description,
  action,
  align = "start",
  titleClassName = "",
}: Props) {
  const centered = align === "center";

  return (
    <header
      className={
        centered
          ? "mx-auto flex max-w-2xl flex-col items-center text-center"
          : "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      }
    >
      <div className={centered ? "flex flex-col items-center" : "min-w-0 flex-1"}>
        {eyebrow?.trim() ? (
          <p className="sf-home-eyebrow mb-3">{eyebrow.trim()}</p>
        ) : null}
        <h2
          id={id}
          className={`sf-section-heading text-balance text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl lg:text-[2rem] ${titleClassName}`}
        >
          {title}
        </h2>
        {description?.trim() ? (
          <p
            className={
              centered
                ? "mt-3 max-w-lg text-pretty text-sm leading-relaxed text-zinc-600 sm:text-base"
                : "mt-2 max-w-xl text-pretty text-sm leading-relaxed text-zinc-600 sm:text-base"
            }
          >
            {description.trim()}
          </p>
        ) : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className={
            centered
              ? "mt-5 inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 underline-offset-4 transition hover:underline"
              : "inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-zinc-900 underline-offset-4 transition hover:underline"
          }
        >
          {action.label}
          <span aria-hidden className="text-base leading-none">
            →
          </span>
        </Link>
      ) : null}
    </header>
  );
}
