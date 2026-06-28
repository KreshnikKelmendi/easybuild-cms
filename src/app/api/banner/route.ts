import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Banner from '@/models/Banner';

export async function GET() {
  try {
    await connectDB();
    
    const banner = await Banner.findOne({ isActive: true })
      .sort({ createdAt: -1 })
      .select('title subtitle image')
      .lean();

    if (!banner) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'No active banner found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: banner },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching banner:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch banner',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('🔵 Starting banner creation...');
    await connectDB();
    console.log('✅ Database connected');
    
    const body = await request.json();
    console.log('📝 Request body:', body);
    const { title, subtitle, image } = body;

    // Validate required fields (title, subtitle, and image must have all languages)
    if (!title || !subtitle || !image ||
        !title.en || !title.de || !title.al || 
        !subtitle.en || !subtitle.de || !subtitle.al) {
      console.log('❌ Validation failed:', { title, subtitle, image });
      return NextResponse.json(
        { 
          success: false, 
          message: 'Title and subtitle are required in all languages (English, German, Albanian), and image is required' 
        },
        { status: 400 }
      );
    }

    console.log('✅ Validation passed');

    // Create banner data object
    const bannerData = {
      title,
      subtitle,
      image,
      isActive: true,
    };

    console.log('📊 Banner data to save:', bannerData);

    // Create new banner (this will automatically deactivate previous banners due to the pre-save hook)
    const newBanner = new Banner(bannerData);

    await newBanner.save();
    console.log('✅ Banner saved successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'Banner created successfully',
      data: newBanner 
    }, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating banner:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create banner',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
