import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { shortId: string } }
) {
  try {
    const shortId = params.shortId;

    const url = await prisma.url.findUnique({
      where: {
        shortId,
      },
    });

    if (!url) {
      return NextResponse.json({ error: 'URL not found' }, { status: 404 });
    }

    // Increment visit count in the background
    prisma.url.update({
      where: { id: url.id },
      data: {
        visits: {
          increment: 1,
        },
      },
    }).catch((err) => {
      console.error('Visit count update failed:', err);
    });

    // Ensure redirect URL has a protocol
    let redirectUrl = url.originalUrl;
    if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
      redirectUrl = 'https://' + redirectUrl;
    }

    // Return an actual redirect response
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Error fetching URL:', error);
    return NextResponse.json(
      {
        error: 'Failed to process redirect',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
