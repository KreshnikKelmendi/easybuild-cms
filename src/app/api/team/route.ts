import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Team from '@/models/Team';

export async function GET() {
  try {
    await connectDB();
    
    const team = await Team.findOne({ isActive: true }).sort({ createdAt: -1 });
    
    if (!team) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'No active team section found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: team 
    });
  } catch (error) {
    console.error('Error fetching team:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch team',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('🔵 Starting team creation...');
    await connectDB();
    console.log('✅ Database connected');
    
    const body = await request.json();
    console.log('📝 Request body:', body);
    const { title, firstDescription, secondDescription, image } = body;

    // Validate required fields (title, descriptions, and image must have all languages)
    if (!title || !firstDescription || !secondDescription || !image ||
        !title.en || !title.de || !title.al || 
        !firstDescription.en || !firstDescription.de || !firstDescription.al ||
        !secondDescription.en || !secondDescription.de || !secondDescription.al) {
      console.log('❌ Validation failed:', { title, firstDescription, secondDescription, image });
      return NextResponse.json(
        { 
          success: false, 
          message: 'Title, descriptions are required in all languages (English, German, Albanian), and image is required' 
        },
        { status: 400 }
      );
    }

    console.log('✅ Validation passed');

    // Create team data object
    const teamData = {
      title,
      firstDescription,
      secondDescription,
      image,
      isActive: true,
    };

    console.log('📊 Team data to save:', teamData);

    // Create new team (this will automatically deactivate previous team sections due to the pre-save hook)
    const newTeam = new Team(teamData);

    await newTeam.save();
    console.log('✅ Team saved successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'Team section created successfully',
      data: newTeam 
    }, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating team:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create team section',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
