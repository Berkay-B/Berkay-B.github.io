{
  "name": "nextjs-toets-p6",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "prisma db seed"
  },
  "dependencies": {
    "@prisma/adapter-mariadb": "^7.3.0",
    "@prisma/client": "^7.3.0",
    "chart.js": "^4.5.1",
    "mysql2": "^3.16.2",
    "next": "16.1.6",
    "react": "19.2.3",
    "react-chartjs-2": "^5.3.1",
    "react-dom": "19.2.3"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "dotenv": "^17.2.3",
    "eslint": "^9",
    "eslint-config-next": "16.1.6",
    "prisma": "^7.3.0",
    "tailwindcss": "^4",
    "tsx": "^4.21.0",
    "typescript": "^5"
  }
}
