import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/** Nền gradient mờ + grain cho trang chủ (không chặn click). */
export function HomeAmbientShell({ children }: Props) {
  return (
    <div className="relative isolate min-w-0">
      <div className="sf-home-ambient pointer-events-none absolute inset-x-0 top-0 z-0 h-[min(85vh,900px)]" aria-hidden />
      <div className="sf-home-grain pointer-events-none absolute inset-0 z-[1]" aria-hidden />
      <div className="relative z-[2]">{children}</div>
    </div>
  );
}
