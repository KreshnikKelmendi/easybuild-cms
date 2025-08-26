import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';

export async function GET() {
  try {
    console.log('Debug: Testing MongoDB connection...');
    await connectDB();
    console.log('Debug: MongoDB connected successfully');
    
    // Count all projects
    const totalProjects = await Project.countDocuments({});
    console.log('Debug: Total projects in database:', totalProjects);
    
    // Get all projects (without filtering)
    const allProjects = await Project.find({}).select('_id title isActive').lean();
    console.log('Debug: All projects:', allProjects);
    
    // Get active projects
    const activeProjects = await Project.find({ isActive: true }).select('_id title isActive').lean();
    console.log('Debug: Active projects:', activeProjects);
    
    return NextResponse.json({
      success: true,
      debug: {
        totalProjects,
        allProjects,
        activeProjects,
        message: 'Database debug information'
      }
    });
  } catch (error) {
    console.error('Debug: Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Debug failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
