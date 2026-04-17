app/actions/admin.ts icindekiler

""use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/src/lib/prisma";
import { requireRole } from "@/app/lib/dal";
import { Role } from "@/src/generated/prisma/enums";

export async function updateUserRole(formData: FormData) {
  await requireRole("ADMIN");

  const userId = formData.get("userId") as string;
  const role = formData.get("role") as Role;

  if (!userId || !role) return;
  if (!Object.values(Role).includes(role)) return;

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/admin/users");
}"

app/actions/auth.ts icindekiler

""use server";

import { hash, compare } from "bcrypt";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { createSession, deleteSession } from "@/app/lib/session";

export type FormState =
  | {
      error?: string;
    }
  | undefined;

export async function signup(state: FormState, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password || !name) {
    return { error: "Vul alle velden in" };
  }

  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    return { error: "Email is al in gebruik" };
  }

  const hashedPassword = await hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  await createSession(user.id, user.role);
  redirect("/");
}

export async function login(state: FormState, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Vul alle velden in" };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: "Email of wachtwoord is onjuist" };
  }

  const passwordMatch = await compare(password, user.password);

  if (!passwordMatch) {
    return { error: "Email of wachtwoord is onjuist" };
  }

  await createSession(user.id, user.role);
  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
"

app/actions/courses.ts icindekiler

""use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { requireRole } from "@/app/lib/dal";

export async function createCourse(formData: FormData) {
  const session = await requireRole("DOCENT", "ADMIN");

  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();

  if (!name || !description) {
    return;
  }

  const course = await prisma.course.create({
    data: {
      name,
      description,
      docentId: session.userId,
    },
  });

  revalidatePath("/courses");
  redirect(`/courses/${course.id}`);
}

export async function addAnnouncement(courseId: string, formData: FormData) {
  const session = await requireRole("DOCENT", "ADMIN");

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { docentId: true },
  });

  if (!course) return;
  if (session.role === "DOCENT" && course.docentId !== session.userId) {
    return;
  }

  const title = (formData.get("title") as string)?.trim();
  const body = (formData.get("body") as string)?.trim();

  if (!title || !body) {
    return;
  }

  await prisma.announcement.create({
    data: { title, body, courseId },
  });

  revalidatePath(`/courses/${courseId}`);
}
"

app/actions/enrollments.ts icindekiler
