import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { generateDynamicRecommendations } from '../../../../utils/recommendationSystem';

export const GET = async (request) => {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findOne({ userId });
    
    if (!user?.healthMetrics) {
      return NextResponse.json({ 
        recommendations: [],
        debug: {
          hasRecommendations: false,
          reason: 'No health metrics found'
        }
      });
    }

    // Generate fresh recommendations based on current metrics
    const recommendations = generateDynamicRecommendations(user.healthMetrics);

    return NextResponse.json({
      recommendations,
      debug: {
        hasRecommendations: recommendations.length > 0,
        recommendationCount: recommendations.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};