import Link from "next/link";
import { verifySession } from "@/app/lib/dal";
import { prisma } from "@/src/lib/prisma";
import ChangePasswordForm from "./ChangePasswordForm";

export default async function ProfilePage() {
  const session = await verifySession();

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      enrollments: {
        select: {
          grade: true,
          enrolledAt: true,
          course: { select: { id: true, name: true } },
        },
        orderBy: { enrolledAt: "desc" },
      },
    },
  });

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 space-y-10">
      <section>
        <h1 className="text-2xl font-semibold mb-4">Profiel</h1>
        <dl className="text-sm space-y-1">
          <div>
            <dt className="inline font-medium">Naam: </dt>
            <dd className="inline">{user.name}</dd>
          </div>
          <div>
            <dt className="inline font-medium">E-mail: </dt>
            <dd className="inline">{user.email}</dd>
          </div>
          <div>
            <dt className="inline font-medium">Rol: </dt>
            <dd className="inline">{user.role}</dd>
          </div>
          <div>
            <dt className="inline font-medium">Lid sinds: </dt>
            <dd className="inline">
              {user.createdAt.toLocaleDateString("nl-NL")}
            </dd>
          </div>
        </dl>
      </section>

      <section className="border rounded-lg p-5 bg-white">
        <h2 className="text-lg font-semibold mb-2">Wachtwoord wijzigen</h2>
        <p className="text-sm text-zinc-600 mb-4">
          Wijzig hier je wachtwoord om je account veilig te houden.
        </p>
        <ChangePasswordForm />
      </section>

      {user.role === "STUDENT" && (
        <section>
          <h2 className="text-lg font-semibold mb-2">Mijn inschrijvingen</h2>
          {user.enrollments.length === 0 ? (
            <p className="text-sm text-zinc-600">
              Je bent nog niet ingeschreven.{" "}
              <Link href="/courses" className="underline">
                Bekijk cursussen
              </Link>
              .
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-zinc-600">
                <tr>
                  <th className="py-2">Cursus</th>
                  <th className="py-2">Ingeschreven</th>
                  <th className="py-2">Cijfer</th>
                </tr>
              </thead>
              <tbody>
                {user.enrollments.map((e) => (
                  <tr key={e.course.id} className="border-t">
                    <td className="py-2">
                      <Link
                        href={`/courses/${e.course.id}`}
                        className="underline"
                      >
                        {e.course.name}
                      </Link>
                    </td>
                    <td className="py-2">
                      {e.enrolledAt.toLocaleDateString("nl-NL")}
                    </td>
                    <td className="py-2">
                      {e.grade === null ? "nog geen" : e.grade.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}
    </div>
  );
}