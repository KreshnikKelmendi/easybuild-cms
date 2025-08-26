import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SocialMedia from '@/models/SocialMedia';

// GET all social media
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Check if it's for admin (all items) or frontend (active only)
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('admin') === 'true';
    
    const query = isAdmin ? {} : { isActive: true };
    const socialMedia = await SocialMedia.find(query).sort({ order: 1 });
    
    return NextResponse.json(socialMedia);
  } catch (error) {
    console.error('Error fetching social media:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social media' },
      { status: 500 }
    );
  }
}

// POST new social media
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const socialMedia = new SocialMedia(body);
    await socialMedia.save();
    
    return NextResponse.json(socialMedia, { status: 201 });
  } catch (error) {
    console.error('Error creating social media:', error);
    return NextResponse.json(
      { error: 'Failed to create social media' },
      { status: 500 }
    );
  }
}
