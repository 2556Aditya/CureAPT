// api/user/get-profile/route.js
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import User from '../../../../models/User';

const defaultHealthMetrics = {
  overallHealth: 0,
  generalLifestyle: 0,
  nutritionHydration: 0,
  physicalActivity: 0,
  mindfulnessMentalHealth: 0,
  socialConnection: 0,
  selfCarePersonalGrowth: 0,
};

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    let user = await User.findOne({ userId }).select({
      userId: 1,
      username: 1,
      manifestation: 1,
      profilePhoto: 1,
      streakCount: 1,
      lastVisit: 1,
      milestone: 1,
      tag: 1,
      hasCompletedAssessment: 1,
      healthMetrics: 1,
      initialAssessment: 1
    });

    if (!user) {
      user = await User.create({
        userId,
        username: 'New User',
        manifestation: 'Initial Manifestation',
        hasCompletedAssessment: false,
        streakCount: 0,
        milestone: 0,
        tag: 'Beginner',
        healthMetrics: defaultHealthMetrics,
      });
    }

    const hasValidMetrics =
      user.healthMetrics &&
      Object.values(user.healthMetrics).some(
        (value) => typeof value === 'number' && !isNaN(value) && value >= 0,
      );

    return NextResponse.json({
      ...user.toObject(),
      needsAssessment: !hasValidMetrics,
      hasMetrics: hasValidMetrics,
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}