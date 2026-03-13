import { NextResponse } from 'next/server';

export function GET() {
  return new Response('ok', {
    status: 200,
  });
}