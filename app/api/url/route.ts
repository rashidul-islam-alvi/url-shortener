import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { prisma } from '@/lib/db';

// Generate a short ID
function generateShortId() {
  return nanoid(6); // Creates a 6-character ID
}

// Create a new shortened URL
export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }
    
    // Validate URL format
    let originalUrl = url.trim();
    try {
      // If URL doesn't have a protocol, add https://
      if (!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')) {
        originalUrl = 'https://' + originalUrl;
      }
      
      // Check if it's a valid URL format
      new URL(originalUrl);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }
    
    // Generate a short ID and ensure it's unique
    let shortId = generateShortId();
    let existingUrl = await prisma.url.findUnique({ where: { shortId } });
    let attempts = 0;
    
    // If collision happens, generate a new ID (very unlikely but possible)
    while (existingUrl && attempts < 5) {
      shortId = generateShortId();
      existingUrl = await prisma.url.findUnique({ where: { shortId } });
      attempts++;
    }
    
    if (existingUrl) {
      return NextResponse.json({ error: 'Failed to generate unique short ID' }, { status: 500 });
    }
    
    const newUrl = await prisma.url.create({
      data: {
        originalUrl,
        shortId,
      },
    });
    
    // Get the base URL properly
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http://' : 'https://';
    const shortUrl = `${protocol}${host}/${shortId}`;
    
    return NextResponse.json({ 
      id: newUrl.id,
      shortId: newUrl.shortId,
      originalUrl: newUrl.originalUrl,
      shortUrl
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating shortened URL:', error);
    return NextResponse.json({ 
      error: 'Failed to create shortened URL',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// Get all URLs (for admin purposes)
export async function GET() {
  try {
    const urls = await prisma.url.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(urls);
  } catch (error) {
    console.error('Error fetching URLs:', error);
    return NextResponse.json({ error: 'Failed to fetch URLs' }, { status: 500 });
  }
}