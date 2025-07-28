import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
  
  return NextResponse.json({
    message: 'API routes are working!',
    timestamp: new Date().toISOString(),
    env: {
      hasDatabase: !!databaseUrl,
      hasDATABASE_URL: !!process.env.DATABASE_URL,
      hasNETLIFY_DATABASE_URL: !!process.env.NETLIFY_DATABASE_URL,
      nodeEnv: process.env.NODE_ENV,
      databaseUrlSource: process.env.DATABASE_URL ? 'DATABASE_URL' : 
                        process.env.NETLIFY_DATABASE_URL ? 'NETLIFY_DATABASE_URL' : 'none'
    }
  });
}