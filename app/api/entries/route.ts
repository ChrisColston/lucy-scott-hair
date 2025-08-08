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
  console.log('POST /api/entries - Request received');
  try {
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    // Validate required fields
    if (body.type == null || body.amount == null || body.date == null) {
      const errorMsg = 'Missing required fields: type, amount, date';
      console.error('Validation error:', errorMsg);
      return NextResponse.json(
        { error: errorMsg },
        { status: 400 }
      );
    }

    // Ensure amount is a valid number
    const amount = parseFloat(body.amount);
    if (isNaN(amount)) {
      const errorMsg = 'Invalid amount provided';
      console.error('Validation error:', errorMsg);
      return NextResponse.json(
        { error: errorMsg },
        { status: 400 }
      );
    }

    console.log('Attempting to insert into database...');
    
    try {
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
      
      console.log('Successfully inserted entry:', newEntry[0]);
      return NextResponse.json(newEntry[0], { status: 201 });
    } catch (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }
  } catch (error) {
    console.error('Error creating entry:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create entry',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}