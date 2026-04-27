// src/app/api/user/update-streak/route.js
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import User from '../../../../models/User';

export async function POST(request) {
    try {
      const { userId } = getAuth(request);
      if (!userId) {
        console.log('Unauthorized request');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  
      await connectToDatabase();
      const user = await User.findOne({ userId });
  
      if (!user) {
        console.log('User not found');
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
  
      const now = new Date();
      const lastVisit = user.lastVisit ? new Date(user.lastVisit) : new Date(0);
      
      // Get dates without time and normalize to UTC
      const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      const lastVisitDate = new Date(Date.UTC(lastVisit.getUTCFullYear(), lastVisit.getUTCMonth(), lastVisit.getUTCDate()));
      
      const diffDays = Math.round((today - lastVisitDate) / (1000 * 60 * 60 * 24));
      console.log(`Current streak: ${user.streakCount}, Last visit: ${lastVisit.toISOString()}, Days difference: ${diffDays}`);
  
      let newStreakCount = user.streakCount || 0;
      let newMilestone = user.milestone || 0;
      let newTag = user.tag || 'Beginner';
  
      // Streak logic
      if (diffDays === 0) {
        // Same day - maintain streak
        console.log('Same day visit - maintaining streak');
      }
      else if (diffDays === 1) {
        // Next day - increment streak
        newStreakCount += 1;
        console.log('Consecutive day visit - incrementing streak');
      }
      else if (diffDays > 1) {
        // Missed days - reset streak to 0
        console.log(`${diffDays} days missed - resetting streak`);
        newStreakCount = 0;
        // Keep milestone as highest achieved
        newMilestone = user.milestone || 0;
      }
  
      // Update milestone and tag if streak is higher
      if (newStreakCount > newMilestone) {
        newMilestone = newStreakCount;
        newTag = getNextTag(newMilestone);
        console.log(`New milestone achieved: ${newMilestone}, New tag: ${newTag}`);
      }
  
      // Save updates
      const updateResult = await User.findOneAndUpdate(
        { userId },
        {
          $set: {
            streakCount: newStreakCount,
            lastVisit: now,
            milestone: newMilestone,
            tag: newTag
          }
        },
        { new: true }
      );
  
      console.log(`Updated user stats - Streak: ${newStreakCount}, Milestone: ${newMilestone}, Tag: ${newTag}`);
  
      return NextResponse.json({ 
        streakCount: newStreakCount, 
        milestone: newMilestone,
        tag: newTag 
      });
      
    } catch (error) {
      console.error('Error updating streak:', error);
      return NextResponse.json({ error: error.message || 'Failed to update streak' }, { status: 500 });
    }
}

function getNextTag(milestone) {
  if (milestone >= 1600) return 'Legend';
  if (milestone >= 800) return 'Master';
  if (milestone >= 400) return 'Expert';
  if (milestone >= 200) return 'Pro';
  if (milestone >= 100) return 'Intermediate';
  return 'Beginner';
}