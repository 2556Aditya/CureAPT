// src/app/api/journal/route.js
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import JournalEntry from '../../../models/JournalEntry';

export async function GET(request) {
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();

  const entries = await JournalEntry.find({ userId }).sort({ createdAt: -1 });
  return NextResponse.json(entries);
}

export async function POST(request) {
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    await connectToDatabase();

    const newEntry = new JournalEntry({
      userId,
      content: body.content,
    });

    await newEntry.save();

    return NextResponse.json(newEntry, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}