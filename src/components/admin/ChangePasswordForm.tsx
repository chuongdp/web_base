"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  changePasswordAction,
  type ChangePasswordState,
} from "@/app/actions/changePasswordAction";

const initial: ChangePasswordState = { ok: false, error: null };

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state.ok]);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">Đổi mật khẩu</h2>
      <p className="mt-1 text-sm text-zinc-600">Dùng mật khẩu hiện tại để xác nhận, sau đó nhập mật khẩu mới.</p>

      <form ref={formRef} action={formAction} className="mt-6 max-w-md space-y-4">
        <div>
          <label htmlFor="currentPassword" className="mb-1.5 block text-sm font-medium text-zinc-700">
            Mật khẩu hiện tại
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="mb-1.5 block text-sm font-medium text-zinc-700">
            Mật khẩu mới
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
          <p className="mt-1 text-xs text-zinc-500">Tối thiểu 8 ký tự.</p>
        </div>
        <div>
          <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-zinc-700">
            Xác nhận mật khẩu mới
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>

        {state.error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>
        ) : null}
        {state.ok ? (
          <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
            Đã cập nhật mật khẩu.
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:opacity-60"
        >
          {pending ? "Đang lưu…" : "Cập nhật mật khẩu"}
        </button>
      </form>
    </div>
  );
}
