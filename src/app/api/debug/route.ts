import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    env: {
      SCRAPTPRESS_API_URL: process.env.SCRAPTPRESS_API_URL || 'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
      FIREBASE_SERVICE_ACCOUNT_JSON: process.env.FIREBASE_SERVICE_ACCOUNT_JSON ? 'SET' : 'NOT SET'
    }
  });
}
