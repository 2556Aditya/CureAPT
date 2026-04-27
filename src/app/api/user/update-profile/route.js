// src/app/api/user/update-profile/route.js
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import connectToDatabase from '../../../../lib/mongodb';
import User from '../../../../models/User';

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const username = formData.get('username');
    const manifestation = formData.get('manifestation');
    const profilePhoto = formData.get('profilePhoto');

    if (!username || !manifestation) {
      return NextResponse.json({ error: 'Username and manifestation are required' }, { status: 400 });
    }

    await connectToDatabase();

    // Prepare update data
    const updateData = { username, manifestation };

    // Handle profile photo upload
    if (profilePhoto && profilePhoto.size > 0) {
      if (!profilePhoto.type?.startsWith('image/')) {
        return NextResponse.json({ error: 'Profile photo must be an image' }, { status: 400 });
      }

      const bytes = await profilePhoto.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const extension = profilePhoto.type.split('/')[1] || 'jpg';
      const fileName = `${userId}-${Date.now()}.${extension}`;
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      const filePath = join(uploadDir, fileName);

      await mkdir(uploadDir, { recursive: true });
      await writeFile(filePath, buffer);
      updateData.profilePhoto = `/uploads/${fileName}`;
    }

    // Update user in the database
    const result = await User.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true }
    );

    if (!result) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update profile' }, { status: 500 });
  }
}