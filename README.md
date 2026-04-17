## Error Type
Runtime PrismaClientValidationError

## Error Message

Invalid `__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].user.findUnique()` invocation in
C:\Users\SD Student\Documents\GitHub\sd24-p07-nextjs-eindtoets-Berkay-B\.next\dev\server\chunks\ssr\[root-of-the-server]__0g61g30._.js:81:156

  78 ;
  79 async function ProfilePage() {
  80     const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$dal$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifySession"])();
→ 81     const user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
           where: {
             id: "c7e1bc26-7dae-41e7-8773-c638b5a71ea4"
           },
           select: {
             id: true,
             name: true,
             email: true,
             role: true,
             createdAt: true,
             favoriteCourses: {
             ~~~~~~~~~~~~~~~
               select: {
                 id: true,
                 name: true
               },
               orderBy: {
                 name: "asc"
               }
             },
             enrollments: {
               select: {
                 grade: true,
                 enrolledAt: true,
                 course: {
                   select: {
                     id: true,
                     name: true
                   }
                 }
               },
               orderBy: {
                 enrolledAt: "desc"
               }
             },
         ?   password?: true,
         ?   updatedAt?: true,
         ?   taughtCourses?: true,
         ?   _count?: true
           }
         })

Unknown field `favoriteCourses` for select statement on model `User`. Available options are marked with ?.


    at <unknown> (app\profile\page.tsx:9:34)
    at  ProfilePage (app\profile\page.tsx:9:16)
    at resolveErrorDev (file://C:/Users/SD Student/Documents/GitHub/sd24-p07-nextjs-eindtoets-Berkay-B/.next/dev/static/chunks/node_modules_next_dist_compiled_react-server-dom-turbopack_0p3wegg._.js:1919:105)
    at processFullStringRow (file://C:/Users/SD Student/Documents/GitHub/sd24-p07-nextjs-eindtoets-Berkay-B/.next/dev/static/chunks/node_modules_next_dist_compiled_react-server-dom-turbopack_0p3wegg._.js:2434:29)
    at processFullBinaryRow (file://C:/Users/SD Student/Documents/GitHub/sd24-p07-nextjs-eindtoets-Berkay-B/.next/dev/static/chunks/node_modules_next_dist_compiled_react-server-dom-turbopack_0p3wegg._.js:2393:9)
    at processBinaryChunk (file://C:/Users/SD Student/Documents/GitHub/sd24-p07-nextjs-eindtoets-Berkay-B/.next/dev/static/chunks/node_modules_next_dist_compiled_react-server-dom-turbopack_0p3wegg._.js:2502:221)
    at progress (file://C:/Users/SD Student/Documents/GitHub/sd24-p07-nextjs-eindtoets-Berkay-B/.next/dev/static/chunks/node_modules_next_dist_compiled_react-server-dom-turbopack_0p3wegg._.js:2689:13)

## Code Frame
   7 |   const session = await verifySession();
   8 |
>  9 |   const user = await prisma.user.findUnique({
     |                                  ^
  10 |     where: { id: session.userId },
  11 |     select: {
  12 |       id: true,

Next.js version: 16.2.0 (Turbopack)
