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
  favoriteCourses Course[]   @relation("FavoriteCourses")
}