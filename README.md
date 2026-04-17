import { notFound } from "next/navigation";
import { verifySession } from "@/app/lib/dal";
import { prisma } from "@/src/lib/prisma";
import { addAnnouncement } from "@/app/actions/courses";
import { enroll, leave, setGrade } from "@/app/actions/enrollments";
import FavoriteButton from "./FavoriteButton";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await verifySession();

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      docent: { select: { name: true, id: true } },
      announcements: { orderBy: { createdAt: "desc" } },
      enrollments: {
        include: { student: { select: { name: true, email: true } } },
        orderBy: { enrolledAt: "asc" },
      },
      favoritedBy:
        session.role === "STUDENT"
          ? {
              where: { id: session.userId },
              select: { id: true },
            }
          : false,
    },
  });

  if (!course) notFound();

  const isDocentOwner =
    session.role === "DOCENT" && course.docentId === session.userId;
  const canManage = isDocentOwner || session.role === "ADMIN";

  const myEnrollment =
    session.role === "STUDENT"
      ? course.enrollments.find((e) => e.studentId === session.userId)
      : null;

  const isFavorite =
    session.role === "STUDENT" &&
    Array.isArray(course.favoritedBy) &&
    course.favoritedBy.length > 0;

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-semibold">{course.name}</h1>
      <p className="text-sm text-zinc-600 mb-1">
        Docent: {course.docent.name}
      </p>
      <p className="mb-6">{course.description}</p>

      {session.role === "STUDENT" && (
        <section className="mb-8 space-y-3">
          <FavoriteButton
            courseId={course.id}
            initialIsFavorite={Boolean(isFavorite)}
          />

          {myEnrollment ? (
            <form action={leave.bind(null, course.id)}>
              <p className="text-sm mb-2">
                Je bent ingeschreven. Cijfer:{" "}
                {myEnrollment.grade === null
                  ? "nog geen"
                  : myEnrollment.grade.toFixed(1)}
              </p>
              <button
                type="submit"
                className="rounded border px-3 py-1 text-sm"
              >
                Uitschrijven
              </button>
            </form>
          ) : (
            <form action={enroll.bind(null, course.id)}>
              <button
                type="submit"
                className="rounded bg-black text-white px-3 py-1 text-sm"
              >
                Inschrijven
              </button>
            </form>
          )}
        </section>
      )}

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Mededelingen</h2>
        {course.announcements.length === 0 ? (
          <p className="text-sm text-zinc-600">Nog geen mededelingen.</p>
        ) : (
          <ul className="space-y-3 mb-4">
            {course.announcements.map((a) => (
              <li key={a.id} className="border rounded p-3">
                <p className="font-medium">{a.title}</p>
                <p className="text-sm">{a.body}</p>
                <p className="text-xs text-zinc-500 mt-1">
                  {a.createdAt.toLocaleDateString("nl-NL")}
                </p>
              </li>
            ))}
          </ul>
        )}

        {canManage && (
          <form
            action={addAnnouncement.bind(null, course.id)}
            className="flex flex-col gap-2 border-t pt-4"
          >
            <h3 className="text-sm font-semibold">Nieuwe mededeling</h3>
            <input
              name="title"
              placeholder="Titel"
              required
              className="border rounded px-2 py-1"
            />
            <textarea
              name="body"
              placeholder="Inhoud"
              required
              rows={3}
              className="border rounded px-2 py-1"
            />
            <button
              type="submit"
              className="rounded bg-black text-white px-3 py-1 text-sm self-start"
            >
              Plaatsen
            </button>
          </form>
        )}
      </section>

      {canManage && (
        <section>
          <h2 className="text-lg font-semibold mb-2">Ingeschreven studenten</h2>
          {course.enrollments.length === 0 ? (
            <p className="text-sm text-zinc-600">Nog geen inschrijvingen.</p>
          ) : (
            <ul className="space-y-2">
              {course.enrollments.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between border rounded p-2"
                >
                  <span className="text-sm">
                    {e.student.name}{" "}
                    <span className="text-zinc-500">({e.student.email})</span>
                  </span>
                  <form action={setGrade} className="flex items-center gap-2">
                    <input type="hidden" name="enrollmentId" value={e.id} />
                    <input
                      name="grade"
                      type="number"
                      step="0.1"
                      min="1"
                      max="10"
                      defaultValue={e.grade ?? ""}
                      className="border rounded px-2 py-1 w-20 text-sm"
                      placeholder="cijfer"
                    />
                    <button
                      type="submit"
                      className="rounded border px-2 py-1 text-sm"
                    >
                      Opslaan
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}