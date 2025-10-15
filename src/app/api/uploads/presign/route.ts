import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    uploads: [
      {
        tempId: 'temp-1',
        presignedUrl: 'https://example.com/upload',
        headers: { 'x-mock': 'true' },
      },
    ],
  });
}
