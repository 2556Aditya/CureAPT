// api/user/check-assessment/route.js
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import User from '../../../../models/User';

// api/user/check-assessment/route.js// api/user/check-assessment/route.js
// api/user/check-assessment/route.js
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findOne({ userId });

    if (!user) {
      return NextResponse.json({ 
        needsAssessment: true,
        hasValidMetrics: false,
        hasCompletedAssessment: false
      });
    }

    // Check if all required metrics exist and have valid numbers
    const hasValidMetrics = user.healthMetrics && 
      ['overallHealth', 'generalLifestyle', 'nutritionHydration', 
       'physicalActivity', 'mindfulnessMentalHealth', 'socialConnection', 
       'selfCarePersonalGrowth'].every(metric => 
        typeof user.healthMetrics[metric] === 'number' && 
        !isNaN(user.healthMetrics[metric]) &&
        user.healthMetrics[metric] >= 0
      );

    return NextResponse.json({ 
      needsAssessment: !hasValidMetrics,
      hasValidMetrics,
      hasCompletedAssessment: user.hasCompletedAssessment
    });

  } catch (error) {
    console.error('Check assessment error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}