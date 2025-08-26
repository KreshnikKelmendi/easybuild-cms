import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SocialMedia from '@/models/SocialMedia';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Check if social media already exists
    const existingCount = await SocialMedia.countDocuments();
    if (existingCount > 0) {
      return NextResponse.json(
        { message: 'Social media data already exists' },
        { status: 200 }
      );
    }

    // Initial social media data
    const initialData = [
      {
        platform: 'Facebook',
        icon: 'FaFacebookF',
        url: 'https://facebook.com',
        isActive: true,
        order: 1
      },
      {
        platform: 'Instagram',
        icon: 'FaInstagram',
        url: 'https://instagram.com',
        isActive: true,
        order: 2
      },
      {
        platform: 'Twitter',
        icon: 'FaTwitter',
        url: 'https://twitter.com',
        isActive: true,
        order: 3
      }
    ];

    // Insert initial data
    await SocialMedia.insertMany(initialData);

    return NextResponse.json(
      { message: 'Social media data seeded successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error seeding social media:', error);
    return NextResponse.json(
      { error: 'Failed to seed social media data' },
      { status: 500 }
    );
  }
}
