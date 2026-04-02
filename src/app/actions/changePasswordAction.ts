"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";

export type ChangePasswordState = { ok: boolean; error: string | null };

const initial: ChangePasswordState = { ok: false, error: null };

export async function changePasswordAction(
  _prev: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const session = await auth();
  const email = session?.user?.email?.trim().toLowerCase();
  if (!email) {
    return { ok: false, error: "Chưa đăng nhập." };
  }

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!currentPassword || !newPassword) {
    return { ok: false, error: "Vui lòng điền đủ các trường." };
  }
  if (newPassword.length < 8) {
    return { ok: false, error: "Mật khẩu mới tối thiểu 8 ký tự." };
  }
  if (newPassword !== confirmPassword) {
    return { ok: false, error: "Mật khẩu xác nhận không khớp." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { ok: false, error: "Không tìm thấy tài khoản." };
  }

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) {
    return { ok: false, error: "Mật khẩu hiện tại không đúng." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(newPassword) },
  });

  return { ...initial, ok: true };
}
