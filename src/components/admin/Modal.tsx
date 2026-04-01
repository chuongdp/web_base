"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ open, title, onClose, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open) el.showModal();
    else el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="w-full max-w-lg rounded-lg border border-zinc-200 bg-white p-0 text-zinc-900 shadow-xl backdrop:bg-black/40"
      onClose={onClose}
    >
      <div className="border-b border-zinc-100 px-4 py-3">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="px-4 py-4">{children}</div>
    </dialog>
  );
}
