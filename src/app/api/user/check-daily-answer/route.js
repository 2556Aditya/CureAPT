// api/user/check-daily-answer/route.js
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import User from '../../../../models/User';

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized',
        hasAnswered: false 
      }, { status: 401 });
    }

    if (!date) {
      return NextResponse.json({ 
        success: false, 
        error: 'Date parameter required',
        hasAnswered: false 
      }, { status: 400 });
    }

    const checkDate = new Date(date);
    if (isNaN(checkDate.getTime())) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid date format',
        hasAnswered: false 
      }, { status: 400 });
    }

    checkDate.setHours(0, 0, 0, 0);

    await connectToDatabase();
    const user = await User.findOne({ userId });

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found',
        hasAnswered: false 
      }, { status: 404 });
    }

    const hasAnswered = user.dailyAnswers?.some(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getTime() === checkDate.getTime();
    }) || false;

    return NextResponse.json({ 
      success: true, 
      hasAnswered 
    });

  } catch (error) {
    console.error('Check daily answer error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      hasAnswered: false 
    }, { status: 500 });
  }
}