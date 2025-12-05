import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import StepByStep from '@/models/StepByStep';

export async function GET() {
  try {
    await connectDB();
    
    const stepByStep = await StepByStep.findOne({ isActive: true }).sort({ createdAt: -1 });
    
    if (!stepByStep) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'No active step by step section found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: stepByStep 
    });
  } catch (error) {
    console.error('Error fetching step by step:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch step by step section',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('🔵 Starting step by step creation...');
    await connectDB();
    console.log('✅ Database connected');
    
    const body = await request.json();
    console.log('📝 Request body:', body);
    const { title, description, images } = body;

    // Validate required fields
    const hasValidImages = Array.isArray(images) && images.length >= 3 && images.every((img: unknown) => typeof img === 'string' && img.trim().length > 0);

    if (!title || !description || !images ||
        !title.en || !title.de || !title.al || 
        !description.en || !description.de || !description.al ||
        !hasValidImages) {
      console.log('❌ Validation failed:', { title, description, images });
      return NextResponse.json(
        { 
          success: false, 
          message: 'Title, description, and at least 3 images are required (images must be non-empty strings)' 
        },
        { status: 400 }
      );
    }

    console.log('✅ Validation passed');

    // Create step by step data object
    const stepByStepData = {
      title,
      description,
      images,
      isActive: true,
    };

    console.log('📊 Step by step data to save:', stepByStepData);

    // Create new step by step (this will automatically deactivate previous ones due to the pre-save hook)
    const newStepByStep = new StepByStep(stepByStepData);

    await newStepByStep.save();
    console.log('✅ Step by step saved successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'Step by step section created successfully',
      data: newStepByStep 
    }, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating step by step:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create step by step section',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
