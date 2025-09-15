import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AboutBanner from '@/models/AboutBanner';

export async function GET() {
  try {
    await connectDB();
    
    const aboutBanner = await AboutBanner.findOne({ isActive: true }).sort({ createdAt: -1 });
    
    if (!aboutBanner) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'No active about banner found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: aboutBanner 
    });
  } catch (error) {
    console.error('Error fetching about banner:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch about banner',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('🔵 Starting about banner creation...');
    await connectDB();
    console.log('✅ Database connected');
    
    const body = await request.json();
    console.log('📝 Request body:', body);
    const { title, subtitle, image, video } = body;

    // Validate required fields (title, subtitle, image, and video must have all languages)
    if (!title || !subtitle || !image || !video ||
        !title.en || !title.de || !title.al || 
        !subtitle.en || !subtitle.de || !subtitle.al) {
      console.log('❌ Validation failed:', { title, subtitle, image, video });
      return NextResponse.json(
        { 
          success: false, 
          message: 'Title, subtitle, image, and video are required in all languages (English, German, Albanian)' 
        },
        { status: 400 }
      );
    }

    console.log('✅ Validation passed');

    // Create about banner data object
    const aboutBannerData = {
      title,
      subtitle,
      image,
      video,
      isActive: true,
    };

    console.log('📊 About banner data to save:', aboutBannerData);

    // Create new about banner (this will automatically deactivate previous banners due to the pre-save hook)
    const newAboutBanner = new AboutBanner(aboutBannerData);

    await newAboutBanner.save();
    console.log('✅ About banner saved successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'About banner created successfully',
      data: newAboutBanner 
    }, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating about banner:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create about banner',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
