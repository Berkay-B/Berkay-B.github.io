generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "mysql"
}

model Game {
  id        Int      @id @default(autoincrement())
  title     String
  price     Float
  genre     String
  sales     Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
