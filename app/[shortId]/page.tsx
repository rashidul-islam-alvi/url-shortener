import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

interface RedirectPageProps {
  params: Promise<{
    shortId: string;
  }>;
}

export default async function RedirectPage({ params }: RedirectPageProps) {
  const { shortId } = await params;

  const url = await prisma.url.findUnique({
    where: {
      shortId,
    },
  });

  if (!url) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold">URL not found</h1>

        <p>The shortened URL you're looking for doesn't exist.</p>

        <a href="/" className="mt-4 text-blue-500 hover:underline">
          Go back to homepage
        </a>
      </div>
    );
  }

  // Increment visit count
  await prisma.url.update({
    where: {
      id: url.id,
    },
    data: {
      visits: {
        increment: 1,
      },
    },
  });

  const redirectUrl = url.originalUrl.startsWith("http")
    ? url.originalUrl
    : `https://${url.originalUrl}`;

  redirect(redirectUrl);
}
