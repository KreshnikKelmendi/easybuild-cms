import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AboutUs from '@/models/AboutUs';

export async function GET() {
  try {
    await connectDB();
    
    const aboutUs = await AboutUs.findOne({ isActive: true }).sort({ createdAt: -1 });
    
    if (!aboutUs) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'No active about us section found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: aboutUs 
    });
  } catch (error) {
    console.error('Error fetching about us:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch about us section',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('🔵 Starting about us creation...');
    await connectDB();
    console.log('✅ Database connected');
    
    const body = await request.json();
    console.log('📝 Request body:', body);
    const { title, description, missionDescription, images } = body;

    // Validate required fields
    if (!title || !description || !missionDescription || !images || images.length === 0 ||
        !title.en || !title.de || !title.al || 
        !description.en || !description.de || !description.al ||
        !missionDescription.en || !missionDescription.de || !missionDescription.al) {
      console.log('❌ Validation failed:', { title, description, missionDescription, images });
      return NextResponse.json(
        { 
          success: false, 
          message: 'Title, description, mission description, and images are required in all languages (English, German, Albanian)' 
        },
        { status: 400 }
      );
    }

    console.log('✅ Validation passed');

    // Create about us data object
    const aboutUsData = {
      title,
      description,
      missionDescription,
      images,
      isActive: true,
    };

    console.log('📊 About us data to save:', aboutUsData);

    // Create new about us section (this will automatically deactivate previous sections due to the pre-save hook)
    const newAboutUs = new AboutUs(aboutUsData);

    await newAboutUs.save();
    console.log('✅ About us section saved successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'About us section created successfully',
      data: newAboutUs 
    }, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating about us section:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create about us section',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
