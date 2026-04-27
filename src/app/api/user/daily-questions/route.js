// api/user/daily-questions/route.js
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { generateDailyQuestions } from '../../../../utils/healthAlgorithm';

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findOne({ userId });
    
    if (!user?.healthMetrics) {
      return NextResponse.json({ questions: [] });
    }

    const questions = generateDailyQuestions(user.healthMetrics);

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}