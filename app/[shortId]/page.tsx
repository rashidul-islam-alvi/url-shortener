import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';

export default async function RedirectPage({ params }: { params: { shortId: string } }) {
  const { shortId } = params;

  const url = await prisma.url.findUnique({
    where: {
      shortId,
    },
  });

  if (!url) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">URL not found</h1>
        <p>The shortened URL you're looking for doesn't exist.</p>
        <a href="/" className="text-blue-500 hover:underline mt-4">
          Go back to homepage
        </a>
      </div>
    );
  }

  // Update visit count in background (no await)
  prisma.url.update({
    where: { id: url.id },
    data: { visits: { increment: 1 } },
  }).catch((e) => {
    console.error('Failed to update visit count:', e);
  });

  let redirectUrl = url.originalUrl;
  if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
    redirectUrl = 'https://' + redirectUrl;
  }

  // ❗ Do NOT wrap this in try/catch!
  redirect(redirectUrl); // This throws to trigger redirect
}
