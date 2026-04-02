"use client";

import { useEffect, useState } from "react";

type Props = {
  id: string;
  name: string;
  label: string;
  hint?: string;
  defaultValue: string;
  placeholder?: string;
  /** Cho phép ô hex rỗng (banner tùy chọn) */
  optional?: boolean;
};

export function ColorHexField({ id, name, label, hint, defaultValue, placeholder, optional }: Props) {
  const [hex, setHex] = useState(defaultValue.trim());

  useEffect(() => {
    setHex(defaultValue.trim());
  }, [defaultValue]);

  const normalized = /^#[0-9A-Fa-f]{6}$/.test(hex);
  const pickerValue = normalized ? hex : "#000000";
  const footerLine = optional ? hint ?? "Để trống ô hex để dùng mặc định." : hint;

  return (
    <div>
      <label htmlFor={`${id}-text`} className="mb-1.5 block text-sm font-medium text-zinc-700">
        {label}
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="color"
          aria-label={`${label} — chọn màu`}
          value={pickerValue}
          onChange={(e) => setHex(e.target.value)}
          className="h-10 w-14 shrink-0 cursor-pointer rounded border border-zinc-300 bg-white p-0.5 shadow-sm"
        />
        <input
          id={`${id}-text`}
          name={name}
          type="text"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          placeholder={placeholder}
          className="min-w-[7rem] flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>
      {footerLine ? <p className="mt-1 text-xs text-zinc-500">{footerLine}</p> : null}
    </div>
  );
}
