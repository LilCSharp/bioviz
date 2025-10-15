import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    images: [
      {
        id: 'img-new',
        name: 'Uploaded.jpg',
        path: ['Gallery'],
        createdAt: new Date().toISOString(),
        type: 'image',
        sizeBytes: 123456,
        mime: 'image/jpeg',
        thumbnailUrl: '/globe.svg',
        originalUrl: 'https://example.com/original.jpg',
      },
    ],
  });
}
