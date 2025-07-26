import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { entries } from '@/lib/schema';
import { desc, eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// GET - Fetch all entries
export async function GET() {
  try {
    const allEntries = await db
      .select()
      .from(entries)
      .orderBy(desc(entries.timestamp));
    
    return NextResponse.json(allEntries);
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch entries' },
      { status: 500 }
    );
  }
}

// POST - Create new entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newEntry = await db
      .insert(entries)
      .values({
        type: body.type,
        service: body.service || null,
        description: body.description || null,
        amount: body.amount.toString(),
        quantity: body.quantity || 1,
        date: body.date,
      })
      .returning();

    return NextResponse.json(newEntry[0], { status: 201 });
  } catch (error) {
    console.error('Error creating entry:', error);
    return NextResponse.json(
      { error: 'Failed to create entry' },
      { status: 500 }
    );
  }
}