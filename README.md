# 🔗 URL Shortener

> A simple and fast URL shortener built with Next.js, TypeScript, Prisma, and PostgreSQL.

## ✨ Features

- Create short URLs
- Redirect to original URLs
- Track link visits
- PostgreSQL database
- Prisma ORM
- Next.js App Router
- Tailwind CSS
- Responsive design

## 🛠️ Tech Stack

- Next.js 15
- React 19
- TypeScript
- Prisma 6
- PostgreSQL
- Tailwind CSS 4

## 📦 Installation
Clone the repo
```bash
git clone <your-repository-url>
cd url-shortener
npm install
```
Create a .env file
```bash
DATABASE_URL="your-postgresql-connection-string"
```
example:
```bash
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
```

## 📦 Database Setup

Generate the Prisma Client:
```bash
npx prisma generate
```
Sync the database schema:
```bash
npx prisma db push
```
The project uses PostgreSQL with Prisma ORM.

Prisma Schema
```bash
model Url {
  id          String   @id @default(cuid())
  shortId     String   @unique
  originalUrl String
  visits      Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```
