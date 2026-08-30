import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface RouteContext {
  params: Promise<{
    shortId: string;
  }>;
}

export async function GET(request: Request, { params }: RouteContext) {
  const { shortId } = await params;

  const url = await prisma.url.findUnique({
    where: {
      shortId,
    },
  });

  if (!url) {
    return NextResponse.json({ error: "URL not found" }, { status: 404 });
  }

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

  return NextResponse.redirect(redirectUrl);
}
