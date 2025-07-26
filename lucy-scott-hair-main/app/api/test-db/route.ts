import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { entries } from '@/lib/schema';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allEntries = await db.select().from(entries);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      entryCount: allEntries.length,
      sampleEntries: allEntries.slice(0, 3),
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}