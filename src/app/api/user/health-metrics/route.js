// api/user/health-metrics/route.js
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import User from '../../../../models/User';

// api/user/health-metrics/route.js
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findOne({ userId });
    
    if (!user?.healthMetrics) {
      return NextResponse.json(getDefaultMetrics());
    }

    // Get latest daily metrics if they exist
    const latestDailyMetrics = user.dailyAnswers?.[user.dailyAnswers.length - 1]?.updatedMetrics;

    // Use latest daily metrics or current metrics, ensuring proper normalization
    const metrics = {
      generalLifestyle: normalizeMetric(latestDailyMetrics?.generalLifestyle ?? user.healthMetrics.generalLifestyle),
      nutritionHydration: normalizeMetric(latestDailyMetrics?.nutritionHydration ?? user.healthMetrics.nutritionHydration),
      physicalActivity: normalizeMetric(latestDailyMetrics?.physicalActivity ?? user.healthMetrics.physicalActivity),
      mindfulnessMentalHealth: normalizeMetric(latestDailyMetrics?.mindfulnessMentalHealth ?? user.healthMetrics.mindfulnessMentalHealth),
      socialConnection: normalizeMetric(latestDailyMetrics?.socialConnection ?? user.healthMetrics.socialConnection),
      selfCarePersonalGrowth: normalizeMetric(latestDailyMetrics?.selfCarePersonalGrowth ?? user.healthMetrics.selfCarePersonalGrowth)
    };

    // Calculate correct overall health
    metrics.overallHealth = calculateOverallHealth(metrics);

    // Update database with corrected metrics
    await User.updateOne(
      { userId },
      { $set: { healthMetrics: metrics } }
    );

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching health metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}

function normalizeMetric(value) {
  return Math.round(Math.min(100, Math.max(0, Number(value) || 0)));
}

function calculateOverallHealth(metrics) {
  return Math.round(
    metrics.generalLifestyle * 0.2 +
    metrics.nutritionHydration * 0.2 +
    metrics.physicalActivity * 0.15 +
    metrics.mindfulnessMentalHealth * 0.15 +
    metrics.socialConnection * 0.15 +
    metrics.selfCarePersonalGrowth * 0.15
  );
}

function getDefaultMetrics() {
  return {
    overallHealth: 0,
    generalLifestyle: 0,
    nutritionHydration: 0,
    physicalActivity: 0,
    mindfulnessMentalHealth: 0,
    socialConnection: 0,
    selfCarePersonalGrowth: 0
  };
}