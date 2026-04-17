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
  favoritedBy   User[]         @relation("FavoriteCourses")
}