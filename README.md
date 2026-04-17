import "dotenv/config";
import { hash } from "bcrypt";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "eindtoets",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Temizleme (foreign key sırasına dikkat)
  await prisma.announcement.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // USERS
  const admin = await prisma.user.create({
    data: {
      email: "admin@school.nl",
      name: "Admin",
      password: await hash("Admin123!", 10),
      role: "ADMIN",
    },
  });

  const docent1 = await prisma.user.create({
    data: {
      email: "docent1@school.nl",
      name: "Docent Jansen",
      password: await hash("Docent123!", 10),
      role: "DOCENT",
    },
  });

  const docent2 = await prisma.user.create({
    data: {
      email: "docent2@school.nl",
      name: "Docent De Vries",
      password: await hash("Docent123!", 10),
      role: "DOCENT",
    },
  });

  const students = await Promise.all(
    [1, 2, 3, 4].map(async (n) =>
      prisma.user.create({
        data: {
          email: `student${n}@school.nl`,
          name: `Student ${n}`,
          password: await hash("Student123!", 10),
          role: "STUDENT",
        },
      }),
    ),
  );

  // COURSES
  const webDev = await prisma.course.create({
    data: {
      name: "Web Development",
      description: "Leer HTML, CSS en JavaScript vanaf de basis.",
      docentId: docent1.id,
    },
  });

  const nextjs = await prisma.course.create({
    data: {
      name: "Next.js & Prisma",
      description: "Full-stack apps bouwen met Next.js 16 en Prisma 7.",
      docentId: docent1.id,
    },
  });

  const dataBases = await prisma.course.create({
    data: {
      name: "Databases",
      description: "Relationele databases, SQL en normalisatie.",
      docentId: docent2.id,
    },
  });

  // ENROLLMENTS
  await prisma.enrollment.createMany({
    data: [
      { studentId: students[0].id, courseId: webDev.id, grade: 7.5 },
      { studentId: students[0].id, courseId: nextjs.id },
      { studentId: students[1].id, courseId: webDev.id, grade: 8.2 },
      { studentId: students[1].id, courseId: dataBases.id, grade: 6.0 },
      { studentId: students[2].id, courseId: nextjs.id, grade: 9.1 },
      { studentId: students[3].id, courseId: dataBases.id },
    ],
  });

  // ⭐ FAVORITES (EN ÖNEMLİ KISIM)
  await prisma.user.update({
    where: { id: students[0].id },
    data: {
      favoriteCourses: {
        connect: [{ id: webDev.id }, { id: nextjs.id }],
      },
    },
  });

  await prisma.user.update({
    where: { id: students[1].id },
    data: {
      favoriteCourses: {
        connect: [{ id: dataBases.id }],
      },
    },
  });

  // ANNOUNCEMENTS
  await prisma.announcement.createMany({
    data: [
      {
        courseId: webDev.id,
        title: "Welkom bij Web Dev",
        body: "Volgende week starten we met HTML.",
      },
      {
        courseId: webDev.id,
        title: "Opdracht 1",
        body: "Maak een simpele landingspagina.",
      },
      {
        courseId: nextjs.id,
        title: "Installatie",
        body: "Zorg dat je Node 20+ hebt geïnstalleerd.",
      },
      {
        courseId: nextjs.id,
        title: "Eerste les",
        body: "We beginnen met server components.",
      },
      {
        courseId: dataBases.id,
        title: "Welkom bij Databases",
        body: "Lees hoofdstuk 1 van het boek.",
      },
      {
        courseId: dataBases.id,
        title: "Oefenopdracht",
        body: "Normaliseer de dataset naar 3NF.",
      },
    ],
  });

  console.log("Database is geseeded!");
  console.log("Login met:");
  console.log("admin@school.nl / Admin123!");
  console.log("docent1@school.nl / Docent123!");
  console.log("student1@school.nl / Student123!");

  void admin;
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });