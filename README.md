URL Shortener

A simple URL shortener built with Next.js, Prisma, and PostgreSQL.

Tech Stack
Next.js 15 — React framework
React 19
TypeScript
Prisma 6 — Database ORM
PostgreSQL — Database
Tailwind CSS 4
Features
Create short URLs from long URLs
Redirect users from short URLs to the original URL
Track the number of visits
Store URL creation and update timestamps
PostgreSQL database managed through Prisma
Prerequisites

Before running the project, make sure you have installed:

Node.js
A PostgreSQL database

The project can use a hosted PostgreSQL database such as Neon.

Getting Started

1. Clone the repository
   git clone <your-repository-url>
   cd url-shortener

2. Install dependencies
   npm install

3. Configure environment variables

Create a .env file in the project root:

DATABASE_URL="your-postgresql-connection-string"

For example:

DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

Never commit your .env file to Git. It may contain database credentials.

4. Generate Prisma Client
   npx prisma generate

5. Set up the database

Push the Prisma schema to your PostgreSQL database:

npx prisma db push

The database schema is defined in:

prisma/schema.prisma

6. Start the development server
   npm run dev

The application will be available at:

http://localhost:3000

Available Scripts
Command Description
npm run dev Start the development server
npm run build Create a production build
npm run start Start the production server
npm run lint Run the linter
Prisma

The project currently uses Prisma 6.7.0.

Generate the Prisma Client:

npx prisma generate

Push the schema to the database:

npx prisma db push

Open Prisma Studio to inspect the database:

npx prisma studio

Database Schema

The application currently has one model:

model Url {
id String @id @default(cuid())
shortId String @unique
originalUrl String
visits Int @default(0)
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

Fields
id — Unique database identifier
shortId — Unique identifier used for the shortened URL
originalUrl — The original URL
visits — Number of times the short URL has been visited
createdAt — URL creation timestamp
updatedAt — Last update timestamp
Project Structure
url-shortener/
├── app/ # Next.js application
├── lib/ # Shared utilities and database code
├── prisma/
│ └── schema.prisma # Prisma database schema
├── public/ # Static assets
├── .env # Local environment variables
├── next.config.ts # Next.js configuration
├── package.json # Dependencies and scripts
├── postcss.config.mjs # PostCSS configuration
└── tsconfig.json # TypeScript configuration

Production Build

Create a production build:

npm run build

Then start the production server:

npm run start

Troubleshooting
DATABASE_URL is missing

If you see:

Environment variable not found: DATABASE_URL

make sure a .env file exists in the project root and contains:

DATABASE_URL="your-postgresql-connection-string"

Prisma Client generation fails on Windows

If you see an error such as:

EPERM: operation not permitted, rename ...
query_engine-windows.dll.node

stop any running Node.js/Next.js processes and run:

npx prisma generate

If the error persists, close VS Code and other applications using the project, open a new terminal, and run the command again.

Database is not in sync

Run:

npx prisma db push

Then regenerate Prisma Client:

npx prisma generate

Security

Do not commit .env or expose your PostgreSQL connection string.

Make sure .env is included in .gitignore:

.env
.env.local

License

This project is for learning and development purposes.
