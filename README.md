"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/app/lib/dal";
import { prisma } from "@/src/lib/prisma";

type ToggleFavoriteResult = {
  error?: string;
  success?: true;
};

export async function toggleFavorite(
  courseId: string
): Promise<ToggleFavoriteResult> {
  const session = await verifySession();

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      role: true,
      favoriteCourses: {
        where: { id: courseId },
        select: { id: true },
      },
    },
  });

  if (!user) {
    return { error: "Gebruiker niet gevonden." };
  }

  if (user.role !== "STUDENT") {
    return { error: "Alleen studenten kunnen favorieten beheren." };
  }

  const alreadyFavorite = user.favoriteCourses.length > 0;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      favoriteCourses: alreadyFavorite
        ? {
            disconnect: { id: courseId },
          }
        : {
            connect: { id: courseId },
          },
    },
  });

  revalidatePath("/profile");
  revalidatePath(`/courses/${courseId}`);
  revalidatePath("/courses");

  return { success: true };
}