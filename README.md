schema.prisma kodu bu

"datasource db {
  provider = "mysql"
}

generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

enum Role {
  STUDENT
  DOCENT
  ADMIN
}

model User {
  id            String       @id @default(uuid())
  email         String       @unique
  password      String
  name          String
  role          Role         @default(STUDENT)
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
  taughtCourses Course[]     @relation("DocentCourses")
  enrollments   Enrollment[]
}

model Course {
  id            String         @id @default(uuid())
  name          String
  description   String         @db.Text
  docent        User           @relation("DocentCourses", fields: [docentId], references: [id])
  docentId      String
  enrollments   Enrollment[]
  announcements Announcement[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model Enrollment {
  id         String   @id @default(uuid())
  student    User     @relation(fields: [studentId], references: [id])
  studentId  String
  course     Course   @relation(fields: [courseId], references: [id])
  courseId   String
  grade      Float?
  enrolledAt DateTime @default(now())

  @@unique([studentId, courseId])
}

model Announcement {
  id        String   @id @default(uuid())
  title     String
  body      String   @db.Text
  course    Course   @relation(fields: [courseId], references: [id])
  courseId  String
  createdAt DateTime @default(now())
}
"

seed.ts koduda bu
 
"import "dotenv/config";
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
  // Opschonen (let op volgorde i.v.m. foreign keys)
  await prisma.announcement.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // Users
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

  // Courses
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

  // Enrollments (sommige met cijfer, sommige zonder)
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

  // Announcements (2 per course)
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
        body: "Normaliseer de gegeven dataset naar 3NF.",
      },
    ],
  });

  console.log("Database is geseeded!");
  console.log("Login met:");
  console.log("  admin@school.nl / Admin123!");
  console.log("  docent1@school.nl / Docent123!");
  console.log("  student1@school.nl / Student123!");

  // acknowledge admin reference (silences unused var lint)
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
"

