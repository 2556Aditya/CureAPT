// api/user/save-daily-answers/route.js
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import User from '../../../../models/User';

function isValidNumber(num) {
    return typeof num === 'number' && !isNaN(num) && isFinite(num);
  }

function calculateScoreUpdates(answers) {
  const updates = {
    generalLifestyle: 0,
    nutritionHydration: 0,
    physicalActivity: 0,
    mindfulnessMentalHealth: 0,
    socialConnection: 0,
    selfCarePersonalGrowth: 0
  };

  const metricMap = {
    0: 'generalLifestyle',
    1: 'generalLifestyle',
    2: 'nutritionHydration',
    3: 'nutritionHydration',
    4: 'physicalActivity',
    5: 'physicalActivity',
    6: 'mindfulnessMentalHealth',
    7: 'mindfulnessMentalHealth',
    8: 'socialConnection',
    9: 'socialConnection',
    10: 'selfCarePersonalGrowth',
    11: 'selfCarePersonalGrowth'
  };

  Object.entries(answers).forEach(([index, answer]) => {
    const metric = metricMap[index];
    if (!metric) return;

    if (typeof answer === 'string') {
      switch(answer.toLowerCase()) {
        case 'yes':
          updates[metric] += 5;
          break;
        case 'somewhat':
          updates[metric] += 2.5;
          break;
      }
    } else if (typeof answer === 'number') {
      updates[metric] += (answer / 10) * 5;
    }
  });

  return updates;
}

  // Update the POST handler
  export async function POST(request) {
    try {
      const { userId } = getAuth(request);
      if (!userId) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }
  
      const { date, answers } = await request.json();
      if (!date || !answers) {
        return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
      }
  
      const answerDate = new Date(date);
      if (isNaN(answerDate.getTime())) {
        return NextResponse.json({ success: false, error: 'Invalid date format' }, { status: 400 });
      }
      answerDate.setHours(0, 0, 0, 0);
  
      await connectToDatabase();
      const user = await User.findOne({ userId });
      if (!user) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }
  
      // Ensure healthMetrics exists with valid numbers
      const currentMetrics = {
        generalLifestyle: isValidNumber(user.healthMetrics?.generalLifestyle) ? user.healthMetrics.generalLifestyle : 0,
        nutritionHydration: isValidNumber(user.healthMetrics?.nutritionHydration) ? user.healthMetrics.nutritionHydration : 0,
        physicalActivity: isValidNumber(user.healthMetrics?.physicalActivity) ? user.healthMetrics.physicalActivity : 0,
        mindfulnessMentalHealth: isValidNumber(user.healthMetrics?.mindfulnessMentalHealth) ? user.healthMetrics.mindfulnessMentalHealth : 0,
        socialConnection: isValidNumber(user.healthMetrics?.socialConnection) ? user.healthMetrics.socialConnection : 0,
        selfCarePersonalGrowth: isValidNumber(user.healthMetrics?.selfCarePersonalGrowth) ? user.healthMetrics.selfCarePersonalGrowth : 0
      };
  
      const updates = calculateScoreUpdates(answers);
      const updatedMetrics = { ...currentMetrics };
  Object.entries(updates).forEach(([metric, value]) => {
    if (metric !== 'overallHealth' && isValidNumber(value)) {
      updatedMetrics[metric] = Math.min(100, Math.max(0, currentMetrics[metric] + value));
    }
  });
  
      // Calculate overall health only if all metrics are valid
      const validMetrics = Object.values(updatedMetrics).every(isValidNumber);
      if (!validMetrics) {
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid metric values calculated' 
        }, { status: 400 });
      }
  
      updatedMetrics.overallHealth = Math.round(
        (updatedMetrics.generalLifestyle * 0.2 +
         updatedMetrics.nutritionHydration * 0.2 +
         updatedMetrics.physicalActivity * 0.15 +
         updatedMetrics.mindfulnessMentalHealth * 0.15 +
         updatedMetrics.socialConnection * 0.15 +
         updatedMetrics.selfCarePersonalGrowth * 0.15)
      );
  
      const dailyAnswer = {
        date: answerDate,
        answers: new Map(Object.entries(answers)),
        updatedMetrics
      };
  
      // Update user document
      user.healthMetrics = updatedMetrics;
      user.dailyAnswers = user.dailyAnswers || [];
      user.dailyAnswers.push(dailyAnswer);
  
      await user.save();
  
      return NextResponse.json({ 
        success: true, 
        newMetrics: updatedMetrics 
      });
  
    } catch (error) {
      console.error('Save daily answers error:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 });
    }
  }