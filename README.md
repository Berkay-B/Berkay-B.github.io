## Error Type
Build Error

## Error Message
Module not found: Can't resolve 'bcryptjs'

## Build Output
./app/actions/change-password.ts:3:1
Module not found: Can't resolve 'bcryptjs'
  1 | "use server";
  2 |
> 3 | import bcrypt from "bcryptjs";
    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  4 | import { revalidatePath } from "next/cache";
  5 | import { verifySession } from "@/app/lib/dal";
  6 | import { prisma } from "@/src/lib/prisma";

https://nextjs.org/docs/messages/module-not-found

Next.js version: 16.2.0 (Turbopack)
