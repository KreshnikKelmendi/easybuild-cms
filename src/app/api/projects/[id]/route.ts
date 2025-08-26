import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Fetching project with ID:', params.id);
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      console.log('Invalid ObjectId format:', params.id);
      return NextResponse.json(
        { success: false, message: 'Invalid project ID format' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    const project = await Project.findById(params.id);
    console.log('Found project:', project ? 'Yes' : 'No');
    
    if (!project) {
      console.log('Project not found for ID:', params.id);
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      );
    }

    console.log('Returning project data');
    return NextResponse.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
