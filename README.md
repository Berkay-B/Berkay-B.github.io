"use server";

import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/app/lib/dal";
import { prisma } from "@/src/lib/prisma";

type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

type ChangePasswordResult = {
  error?: string;
  success?: true;
};

export async function changePassword({
  currentPassword,
  newPassword,
}: ChangePasswordInput): Promise<ChangePasswordResult> {
  const session = await verifySession();

  if (!currentPassword || !newPassword) {
    return { error: "Vul alle velden in." };
  }

  if (newPassword.length < 6) {
    return { error: "Nieuw wachtwoord moet minimaal 6 tekens bevatten." };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      password: true,
    },
  });

  if (!user) {
    return { error: "Gebruiker niet gevonden." };
  }

  const passwordMatches = await bcrypt.compare(currentPassword, user.password);

  if (!passwordMatches) {
    return { error: "Huidig wachtwoord is onjuist." };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
    },
  });

  revalidatePath("/profile");

  return { success: true };
}