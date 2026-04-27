// api/user/save-assessment/route.js
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import { calculateHealthMetrics } from '../../../../utils/healthAlgorithm';


// api/user/save-assessment/route.js
export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const answers = await request.json();
    const { scores } = calculateHealthMetrics(answers);

    // Normalize all scores to 0-100 range
    const metrics = {
      generalLifestyle: Math.round(Math.min(100, Math.max(0, scores.generalLifestyle))),
      nutritionHydration: Math.round(Math.min(100, Math.max(0, scores.nutritionHydration))),
      physicalActivity: Math.round(Math.min(100, Math.max(0, scores.physicalActivity))),
      mindfulnessMentalHealth: Math.round(Math.min(100, Math.max(0, scores.mindfulnessMentalHealth))),
      socialConnection: Math.round(Math.min(100, Math.max(0, scores.socialConnection))),
      selfCarePersonalGrowth: Math.round(Math.min(100, Math.max(0, scores.selfCarePersonalGrowth)))
    };

    // Calculate overall health as weighted average
    metrics.overallHealth = Math.round(
      (metrics.generalLifestyle * 0.2 +
       metrics.nutritionHydration * 0.2 +
       metrics.physicalActivity * 0.15 +
       metrics.mindfulnessMentalHealth * 0.15 +
       metrics.socialConnection * 0.15 +
       metrics.selfCarePersonalGrowth * 0.15)
    );

    await connectToDatabase();
    const { default: User } = await import('../../../../models/User');

    const updateResult = await User.findOneAndUpdate(
      { userId },
      { 
        $set: {
          healthMetrics: metrics,
          hasCompletedAssessment: true,
          lastVisit: new Date()
        }
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      metrics,
      redirect: '/dashboard'
    });

  } catch (error) {
    console.error('Save assessment error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}